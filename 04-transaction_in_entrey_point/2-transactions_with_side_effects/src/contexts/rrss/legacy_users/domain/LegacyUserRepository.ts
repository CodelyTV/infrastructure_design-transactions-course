import { LegacyUser } from "./LegacyUser";

export interface LegacyUserRepository {
	save(user: LegacyUser): Promise<void>;
}
