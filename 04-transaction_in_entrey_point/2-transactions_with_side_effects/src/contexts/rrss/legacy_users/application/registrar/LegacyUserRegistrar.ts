import { LegacyUser } from "../../domain/LegacyUser";
import { LegacyUserRepository } from "../../domain/LegacyUserRepository";

export class LegacyUserRegistrar {
	constructor(private readonly repository: LegacyUserRepository) {}

	async registrar(id: string, name: string): Promise<void> {
		const user = LegacyUser.create(id, name);

		await this.repository.save(user);
	}
}
