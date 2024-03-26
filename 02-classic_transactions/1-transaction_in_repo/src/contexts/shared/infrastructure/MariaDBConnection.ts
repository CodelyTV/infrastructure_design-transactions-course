import { createPool, Pool } from "mariadb";

interface MinimalConnection {
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
		const conn = await this.getConnection();
		const rows = (await conn.query(query)) as T[];

		return rows[0] ?? null;
	}

	async searchAll<T>(query: string): Promise<T[]> {
		const conn = await this.getConnection();

		return (await conn.query(query)) as T[];
	}

	async execute(query: string): Promise<void> {
		const conn = await this.getConnection();
		await conn.query(query);
	}

	async truncate(users: string): Promise<void> {
		await this.execute(`TRUNCATE TABLE ${users}`);
	}

	async transactional<T>(fn: (connection: MariaDBConnection) => Promise<T>): Promise<T> {
		const connection = await this.getConnection();

		try {
			await connection.beginTransaction();

			const result = await fn(this);

			await connection.commit();

			return result;
		} catch (error) {
			await connection.rollback();

			throw error;
		}
	}

	async beginTransaction(): Promise<void> {
		this.connection = await this.getConnection();

		await this.connection.beginTransaction();
	}

	async commit(): Promise<void> {
		await this.connection?.commit();
	}

	async rollback(): Promise<void> {
		await this.connection?.rollback();
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
