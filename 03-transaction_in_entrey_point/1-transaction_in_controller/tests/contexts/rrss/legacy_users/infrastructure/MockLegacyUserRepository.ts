import { LegacyUser } from "../../../../../src/contexts/rrss/legacy_users/domain/LegacyUser";
import { LegacyUserRepository } from "../../../../../src/contexts/rrss/legacy_users/domain/LegacyUserRepository";

export class MockLegacyUserRepository implements LegacyUserRepository {
	private readonly mockSave = jest.fn();
	private withError = false;

	async save(user: LegacyUser): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(user.toPrimitives());

		if (this.withError) {
			this.withError = false;
			throw new Error("Error saving user in mock legacy user repository");
		}

		return Promise.resolve();
	}

	shouldSave(user: LegacyUser): void {
		this.mockSave(user.toPrimitives());
	}
}
