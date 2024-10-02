import { format, sub } from "date-fns";
import LocalStorageService from "./LocalStorageService";
import Loki from "lokijs";

interface Group {
    id: number;
    name: string;
}

interface User {
    id: number;
    first_name: string;
}

interface DailyShipping {
    date: string;
    who: {
        a: User;
        b: User;
    };
}

export default class GroupManagementService extends LocalStorageService {
    private readonly collectionName = `Ship_${this.groupId}`;
    private readonly today = format(new Date(), "dd/MM/yyyy");
    private readonly yesterday = format(
        sub(new Date(), { days: 1 }),
        "dd/MM/yyyy",
    );
    private readonly shippingOfTheDay;
    private readonly shippingUsers;
    private readonly allowedGroups =
        this.db.getCollection<Group>("allowed_groups");

    constructor(
        db: Loki,
        private readonly groupId: number,
    ) {
        super(db);
        this.shippingOfTheDay = this.db.getCollection<DailyShipping>(
            this.collectionName,
        );
        if (this.shippingOfTheDay === null)
            this.shippingOfTheDay = this.db.addCollection<DailyShipping>(
                this.collectionName,
            );

        this.shippingUsers = this.db.getCollection<User>(
            `${this.collectionName}_${this.today}_users`,
        );
        this.shippingUsers.ensureUniqueIndex("id");
    }

    addToAllowed(groupName: string) {
        this.allowedGroups.insert({ id: this.groupId, name: groupName });
    }

    isAllowed(): boolean {
        if (this.allowedGroups.findOne({ id: this.groupId })) return true;
        return false;
    }

    dailySetup() {
        if (this.shippingUsers === null)
            this.db.addCollection(
                `${this.collectionName}_${this.today}_users`,
                {
                    indices: ["id"],
                },
            );

        const yesterdayUsersColl = this.db.getCollection(
            `${this.collectionName}_${this.yesterday}_users`,
        );
        if (yesterdayUsersColl !== null)
            this.db.removeCollection(
                `${this.collectionName}_${this.yesterday}_users`,
            );
    }

    addUserIfNonExistent(user: User) {
        const userFromDb = this.shippingUsers.findOne({ id: user.id });

        if (userFromDb?.first_name) return;
        this.shippingUsers.insert(user);
    }
}
