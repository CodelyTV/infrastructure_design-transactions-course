import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UserId } from "../../users/domain/UserId";
import { UserName } from "../../users/domain/UserName";

export type LegacyUserPrimitives = {
	id: string;
	name: string;
};

export class LegacyUser extends AggregateRoot {
	private constructor(
		public readonly id: UserId,
		public readonly name: UserName,
	) {
		super();
	}

	static create(id: string, name: string): LegacyUser {
		return new LegacyUser(new UserId(id), new UserName(name));
	}

	static fromPrimitives(primitives: LegacyUserPrimitives): LegacyUser {
		return new LegacyUser(new UserId(primitives.id), new UserName(primitives.name));
	}

	toPrimitives(): LegacyUserPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
		};
	}
}
