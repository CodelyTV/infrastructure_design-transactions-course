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
		let conn: MinimalConnection | null = null;
		try {
			conn = (await this.pool.getConnection()) as MinimalConnection;
			const rows = (await conn.query(query)) as T[];

			return rows[0] ?? null;
		} finally {
			if (conn) {
				await conn.end();
			}
		}
	}

	async searchAll<T>(query: string): Promise<T[]> {
		let conn: MinimalConnection | null = null;
		try {
			conn = (await this.pool.getConnection()) as MinimalConnection;

			return (await conn.query(query)) as T[];
		} finally {
			if (conn) {
				await conn.end();
			}
		}
	}

	async execute(query: string): Promise<void> {
		let conn: MinimalConnection | null = null;
		try {
			conn = (await this.pool.getConnection()) as MinimalConnection;
			await conn.query(query);
		} finally {
			if (conn) {
				await conn.end();
			}
		}
	}

	async truncate(users: string): Promise<void> {
		await this.execute(`TRUNCATE TABLE ${users}`);
	}

	async beginTransaction(): Promise<void> {
		const connection = (await this.pool.getConnection()) as MinimalConnection;
		await connection.beginTransaction();

		this.connection = connection;
	}

	async commit(): Promise<void> {
		await this.connection?.commit();
		await this.connection?.end();
	}

	async rollback(): Promise<void> {
		await this.connection?.rollback();
		await this.connection?.end();
	}

	async close(): Promise<void> {
		if (this.poolInstance !== null) {
			await this.pool.end();
		}
	}
}
