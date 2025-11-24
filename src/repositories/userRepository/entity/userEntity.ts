import type { UserDTO } from '../schema/dto/userDTO';

export class UserEntity {
    constructor(private _dto: UserDTO) {}

    get id(): string {
        return this._dto.id;
    }

    get email(): string {
        return this._dto.email;
    }

    get name(): string {
        return this._dto.name;
    }

    get profileImage(): string | undefined {
        return this._dto.profileImage;
    }

    get createdAt(): string | undefined {
        return this._dto.createdAt;
    }

    get updatedAt(): string | undefined {
        return this._dto.updatedAt;
    }

    get dto(): UserDTO {
        return this._dto;
    }
}
