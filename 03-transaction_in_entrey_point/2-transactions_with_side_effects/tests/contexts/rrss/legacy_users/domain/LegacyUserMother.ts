import {
	LegacyUser,
	LegacyUserPrimitives,
} from "../../../../../src/contexts/rrss/legacy_users/domain/LegacyUser";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { UserNameMother } from "../../users/domain/UserNameMother";

export class LegacyUserMother {
	static create(params?: Partial<LegacyUserPrimitives>): LegacyUser {
		const primitives: LegacyUserPrimitives = {
			id: UserIdMother.create().value,
			name: UserNameMother.create().value,
			...params,
		};

		return LegacyUser.fromPrimitives(primitives);
	}
}
