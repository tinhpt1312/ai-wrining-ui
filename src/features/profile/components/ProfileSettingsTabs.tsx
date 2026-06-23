"use client";

import { KeyRound, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { ProfileForm } from "./ProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import type { User } from "@/types/api";

export function ProfileSettingsTabs({
  user,
  onUpdated,
}: {
  user: User;
  onUpdated?: (user: User) => void;
}) {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
        <TabsTrigger value="account" className="gap-2">
          <UserCog className="h-4 w-4" />
          Thông tin
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <KeyRound className="h-4 w-4" />
          Bảo mật
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="mt-6">
        <div className="card-elevated p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-fg">
              Thông tin tài khoản
            </h2>
            <p className="text-sm text-muted mt-1">
              Cập nhật tên hiển thị công khai — người khác sẽ thấy trên trang
              Khám phá khi bạn chia sẻ bài viết.
            </p>
          </div>
          <ProfileForm user={user} onUpdated={onUpdated} />
        </div>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-elevated p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-fg">Đổi mật khẩu</h2>
              <p className="text-sm text-muted mt-1">
                Nhập mật khẩu hiện tại và mật khẩu mới (tối thiểu 6 ký tự).
              </p>
            </div>
            <ChangePasswordForm />
          </div>

          <aside className="card-elevated p-5 h-fit space-y-4">
            <h3 className="text-sm font-semibold text-fg">Gợi ý bảo mật</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                Dùng mật khẩu dài, kết hợp chữ và số.
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                Không dùng lại mật khẩu từ dịch vụ khác.
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                Đổi mật khẩu nếu nghi ngờ tài khoản bị lộ.
              </li>
            </ul>
          </aside>
        </div>
      </TabsContent>
    </Tabs>
  );
}
