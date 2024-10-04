import { format, sub } from "date-fns";
import LocalStorageService from "./LocalStorageService";
import Loki from "lokijs";
import { randomInteger } from "./utils";

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
    who: User;
}

export default class GroupManagementService extends LocalStorageService {
    private readonly collectionName = `Ship_${this.groupId}`;
    private readonly groupShipping = this.db.getCollection<DailyShipping>(
        this.collectionName,
    );
    private readonly today = format(new Date(), "dd/MM/yyyy");
    private readonly yesterday = format(
        sub(new Date(), { days: 1 }),
        "dd/MM/yyyy",
    );
    private readonly shippingOfTheDay;
    private shippingUsers: Collection<User>;
    private readonly allowedGroups =
        this.db.getCollection<Group>("allowed_groups");

    public static Kekkorru: User = { id: 153655894, first_name: "Kekkorru" };

    constructor(
        db: Loki,
        private readonly groupId?: number,
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
    }

    addToAllowed(groupName: string) {
        this.allowedGroups.insert({ id: this.groupId, name: groupName });
        this.db.addCollection(this.collectionName);
    }

    isAllowed(): boolean {
        if (this.allowedGroups.findOne({ id: this.groupId })) return true;
        return false;
    }

    getAllAllowedGroupIDs() {
        return this.allowedGroups.data.map(({ id }) => id);
    }

    dailySetup() {
        if (this.shippingUsers === null)
            this.shippingUsers = this.db.addCollection(
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

    generateShipping() {
        const allActiveUsersOfTheDay = this.shippingUsers.data;

        if (allActiveUsersOfTheDay.length === 0)
            throw "Oggi non ha scritto nessuno, pertanto non è stato possible trovare il prescelto da shippare con Kekkorru.";

        const chosenOne =
            allActiveUsersOfTheDay[
                randomInteger(0, allActiveUsersOfTheDay.length - 1)
            ];

        this.groupShipping.insert({ date: this.today, who: chosenOne });

        return chosenOne;
    }
}
