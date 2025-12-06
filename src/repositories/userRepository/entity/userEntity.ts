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
        return this._dto.displayName || this._dto.name;
    }

    get profileImage(): string | undefined {
        return this._dto.photoURL || this._dto.profileImage;
    }

    get googleId(): string | undefined {
        return this._dto.googleId;
    }

    get roleId(): string | undefined {
        return this._dto.roleId;
    }

    get pageAccess(): string[] {
        return this._dto.pageAccess ?? [];
    }

    get isActive(): boolean {
        return this._dto.isActive ?? true;
    }

    get createdAt(): Date | undefined {
        return this._dto.createdAt ? new Date(this._dto.createdAt) : undefined;
    }

    get updatedAt(): Date | undefined {
        return this._dto.updatedAt ? new Date(this._dto.updatedAt) : undefined;
    }

    get deactivatedAt(): Date | undefined {
        return this._dto.deactivatedAt ? new Date(this._dto.deactivatedAt) : undefined;
    }

    get dto(): UserDTO {
        return this._dto;
    }

    // ===== 계산된 속성 =====

    /**
     * 표시용 이니셜 (프로필 이미지가 없을 때 사용)
     */
    get initials(): string {
        return this._dto.name
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    /**
     * 상태 라벨
     */
    get statusLabel(): string {
        return this.isActive ? '활성' : '비활성화됨';
    }

    /**
     * 상태 색상 (Radix UI Badge용)
     */
    get statusColor(): 'green' | 'gray' {
        return this.isActive ? 'green' : 'gray';
    }

    /**
     * 포맷된 생성일
     */
    get formattedCreatedAt(): string {
        if (!this._dto.createdAt) return '-';
        return new Date(this._dto.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }

    /**
     * 포맷된 비활성화일
     */
    get formattedDeactivatedAt(): string {
        if (!this._dto.deactivatedAt) return '-';
        return new Date(this._dto.deactivatedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }
}
