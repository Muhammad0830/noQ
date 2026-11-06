import { StaffItem } from "@/application/staff/interfaces/GetStaffDataQueryInterface.js";

export function toStaffListResource(staffList: StaffItem[]) {
    return staffList.map(staff => ({
        id: staff.id,
        userId: staff.userId,
        shopId: staff.shopId,
        position: staff.position.getValue(),
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
        user: {
            id: staff.user.id,
            name: staff.user.name,
            email: staff.user.email,
            phoneNumber: staff.user.phoneNumber,
            avatarUrl: staff.user.avatarUrl,
            role: staff.user.role,
        }
    }))
}