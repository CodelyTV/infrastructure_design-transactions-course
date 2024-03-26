import { DomainEvent } from "../../domain/event/DomainEvent";
import { EventBus } from "../../domain/event/EventBus";

export class DeferredEventBus implements EventBus {
	private events: DomainEvent[] = [];

	constructor(private readonly bus: EventBus) {}

	async publish(events: DomainEvent[]): Promise<void> {
		this.events.push(...events);

		return Promise.resolve();
	}

	async publishDeferredEvents(): Promise<void> {
		await this.bus.publish(this.events);

		this.events = [];
	}
}
