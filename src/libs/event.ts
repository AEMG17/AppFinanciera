type EventHandler = (data: any) => void;

class Event {
    private events: { [eventName: string]: EventHandler[] };

    constructor() {
        this.events = {};
    }

    on(eventName: string, fn: EventHandler): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
    }

    emit(eventName: string, data: any): void {
        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => fn(data));
        }
    }
}

export default new Event();