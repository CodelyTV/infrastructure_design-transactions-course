import { NextRequest } from "next/server";

import { LegacyUserRegistrar } from "../../../../contexts/rrss/legacy_users/application/registrar/LegacyUserRegistrar";
import { MySqlLegacyUserRepository } from "../../../../contexts/rrss/legacy_users/infrastructure/MySqlLegacyUserRepository";
import { UserRegistrar } from "../../../../contexts/rrss/users/application/registrar/UserRegistrar";
import { MySqlUserRepository } from "../../../../contexts/rrss/users/infrastructure/MySqlUserRepository";
import { DeferredEventBus } from "../../../../contexts/shared/infrastructure/bus/DeferredEventBus";
import { InMemoryEventBus } from "../../../../contexts/shared/infrastructure/bus/InMemoryEventBus";
import { MariaDBConnection } from "../../../../contexts/shared/infrastructure/MariaDBConnection";

const connection = new MariaDBConnection();

const eventBus = new DeferredEventBus(new InMemoryEventBus([]));
const registrar = new UserRegistrar(new MySqlUserRepository(connection), eventBus);
const legacyRegistrar = new LegacyUserRegistrar(new MySqlLegacyUserRepository(connection));

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const body = (await request.json()) as { name: string; email: string; profilePicture: string };

	await connection.transactional(async () => {
		await registrar.registrar(id, body.name, body.email, body.profilePicture);
		await legacyRegistrar.registrar(id, body.name);
		await eventBus.publishDeferredEvents();
	});

	return new Response("", { status: 201 });
}
