import { UserRegistrar } from "../../../../../../src/contexts/rrss/users/application/registrar/UserRegistrar";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { UserMother } from "../../domain/UserMother";
import { UserRegisteredDomainEventMother } from "../../domain/UserRegisteredDomainEventMother";
import { MockLegacyUserRepository } from "../../infrastructure/MockLegacyUserRepository";
import { MockUserRepository } from "../../infrastructure/MockUserRepository";

describe("UserRegistrar should", () => {
	const repository = new MockUserRepository();
	const legacyRepository = new MockLegacyUserRepository();
	const eventBus = new MockEventBus();

	const userRegistrar = new UserRegistrar(repository, legacyRepository, eventBus);

	it("register a valid user", async () => {
		const expectedUser = UserMother.create();
		const expectedUserPrimitives = expectedUser.toPrimitives();

		const expectedDomainEvent = UserRegisteredDomainEventMother.create(expectedUserPrimitives);

		repository.shouldSave(expectedUser);
		legacyRepository.shouldSave(expectedUser);
		eventBus.shouldPublish([expectedDomainEvent]);

		await userRegistrar.registrar(
			expectedUserPrimitives.id,
			expectedUserPrimitives.name,
			expectedUserPrimitives.email,
			expectedUserPrimitives.profilePicture,
		);
	});
});
