import { NextRequest } from "next/server";

import { UserRegistrar } from "../../../../contexts/rrss/users/application/registrar/UserRegistrar";
import { MySqlUserRepository } from "../../../../contexts/rrss/users/infrastructure/MySqlUserRepository";
import { InMemoryEventBus } from "../../../../contexts/shared/infrastructure/bus/InMemoryEventBus";
import { MariaDBConnection } from "../../../../contexts/shared/infrastructure/MariaDBConnection";

const registrar = new UserRegistrar(
	new MySqlUserRepository(new MariaDBConnection()),
	new InMemoryEventBus([]),
);

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const body = (await request.json()) as { name: string; email: string; profilePicture: string };

	await registrar.registrar(id, body.name, body.email, body.profilePicture);

	return new Response("", { status: 201 });
}
