import { UserRegistrar } from "../../../../../../src/contexts/rrss/users/application/registrar/UserRegistrar";
import { MockDatabaseConnection } from "../../../../shared/infrastructure/MockDatabaseConnection";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { UserMother } from "../../domain/UserMother";
import { UserRegisteredDomainEventMother } from "../../domain/UserRegisteredDomainEventMother";
import { MockLegacyUserRepository } from "../../infrastructure/MockLegacyUserRepository";
import { MockUserRepository } from "../../infrastructure/MockUserRepository";

describe("UserRegistrar should", () => {
	const repository = new MockUserRepository();
	const legacyRepository = new MockLegacyUserRepository();
	const databaseConnection = new MockDatabaseConnection();
	const eventBus = new MockEventBus();

	const userRegistrar = new UserRegistrar(
		repository,
		legacyRepository,
		databaseConnection,
		eventBus,
	);

	it("register a valid user within a transaction", async () => {
		const expectedUser = UserMother.create();
		const expectedUserPrimitives = expectedUser.toPrimitives();

		const expectedDomainEvent = UserRegisteredDomainEventMother.create(expectedUserPrimitives);

		databaseConnection.shouldBeginTransaction();
		repository.shouldSave(expectedUser);
		legacyRepository.shouldSave(expectedUser);
		eventBus.shouldPublish([expectedDomainEvent]);
		databaseConnection.shouldCommit();

		await userRegistrar.registrar(
			expectedUserPrimitives.id,
			expectedUserPrimitives.name,
			expectedUserPrimitives.email,
			expectedUserPrimitives.profilePicture,
		);
	});

	it("not register a user if the transaction fails", async () => {
		const expectedUser = UserMother.create();
		const expectedUserPrimitives = expectedUser.toPrimitives();

		databaseConnection.shouldBeginTransaction();
		repository.shouldSave(expectedUser);
		legacyRepository.shouldThrowErrorSaving(expectedUser);
		databaseConnection.shouldRollback();

		await expect(
			userRegistrar.registrar(
				expectedUserPrimitives.id,
				expectedUserPrimitives.name,
				expectedUserPrimitives.email,
				expectedUserPrimitives.profilePicture,
			),
		).rejects.toThrow(new Error("Error saving user in mock legacy user repository"));
	});
});
