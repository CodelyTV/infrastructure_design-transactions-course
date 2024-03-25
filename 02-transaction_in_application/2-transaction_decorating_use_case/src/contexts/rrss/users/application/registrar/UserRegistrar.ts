import { DatabaseConnection } from "../../../../shared/domain/DatabaseConnection";
import { EventBus } from "../../../../shared/domain/event/EventBus";
import { LegacyUserRepository } from "../../domain/LegacyUserRepository";
import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export class UserRegistrar {
	constructor(
		private readonly repository: UserRepository,
		private readonly legacyRepository: LegacyUserRepository,
		private readonly connection: DatabaseConnection,
		private readonly eventBus: EventBus,
	) {}

	async registrar(id: string, name: string, email: string, profilePicture: string): Promise<void> {
		try {
			await this.connection.beginTransaction();

			const user = User.create(id, name, email, profilePicture);

			await this.repository.save(user);
			await this.legacyRepository.save(user);

			await this.eventBus.publish(user.pullDomainEvents());

			await this.connection.commit();
		} catch (error) {
			await this.connection.rollback();

			throw error;
		}
	}
}
