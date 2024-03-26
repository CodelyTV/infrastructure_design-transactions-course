import { LegacyUserRegistrar } from "../../../../../src/contexts/rrss/legacy_users/application/registrar/LegacyUserRegistrar";
import { LegacyUserMother } from "../domain/LegacyUserMother";
import { MockLegacyUserRepository } from "../infrastructure/MockLegacyUserRepository";

describe("LegacyUserRegistrar should", () => {
	const repository = new MockLegacyUserRepository();

	const userRegistrar = new LegacyUserRegistrar(repository);

	it("register a valid user", async () => {
		const expectedUser = LegacyUserMother.create();
		const expectedUserPrimitives = expectedUser.toPrimitives();

		repository.shouldSave(expectedUser);

		await userRegistrar.registrar(expectedUserPrimitives.id, expectedUserPrimitives.name);
	});
});
