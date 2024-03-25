import { createPool, Pool } from "mariadb";

export interface MinimalConnection {
	query: (sql: string) => Promise<unknown>;
	beginTransaction: () => Promise<void>;
	commit: () => Promise<void>;
	rollback: () => Promise<void>;
	end: () => Promise<void>;
}

export class MariaDBConnection {
	private poolInstance: Pool | null = null;
	private connection: MinimalConnection | null = null;

	private get pool(): Pool {
		if (!this.poolInstance) {
			this.poolInstance = createPool({
				host: "localhost",
				user: "codely",
				password: "c0d3ly7v",
				database: "ecommerce",
			});
		}

		return this.poolInstance;
	}

	async searchOne<T>(query: string): Promise<T | null> {
		try {
			const conn = await this.getConnection();
			const rows = (await conn.query(query)) as T[];

			return rows[0] ?? null;
		} finally {
			await this.connection?.end();
			this.connection = null;
		}
	}

	async searchAll<T>(query: string): Promise<T[]> {
		try {
			const conn = await this.getConnection();

			return (await conn.query(query)) as T[];
		} finally {
			await this.connection?.end();
			this.connection = null;
		}
	}

	async execute(query: string): Promise<void> {
		try {
			const conn = await this.getConnection();
			await conn.query(query);
		} finally {
			await this.connection?.end();
			this.connection = null;
		}
	}

	async truncate(users: string): Promise<void> {
		await this.execute(`TRUNCATE TABLE ${users}`);
	}

	async transactional<T>(work: (connection: MinimalConnection) => Promise<T>): Promise<T> {
		const connection = await this.getConnection();

		try {
			await connection.beginTransaction();

			const result = await work(connection);

			await connection.commit();

			return result;
		} catch (error) {
			await connection.rollback();

			throw error;
		} finally {
			await connection.end();
			this.connection = null;
		}
	}

	async beginTransaction(): Promise<void> {
		this.connection = await this.getConnection();

		await this.connection.beginTransaction();
	}

	async commit(): Promise<void> {
		await this.connection?.commit();
		await this.connection?.end();

		this.connection = null;
	}

	async rollback(): Promise<void> {
		await this.connection?.rollback();
		await this.connection?.end();

		this.connection = null;
	}

	async close(): Promise<void> {
		if (this.poolInstance !== null) {
			await this.pool.end();
		}
	}

	private async getConnection(): Promise<MinimalConnection> {
		if (!this.connection) {
			this.connection = (await this.pool.getConnection()) as MinimalConnection;
		}

		return this.connection;
	}
}
