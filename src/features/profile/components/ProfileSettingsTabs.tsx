"use client";

import { KeyRound, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { ProfileForm } from "./ProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { profileMessages } from "@/messages/profile";
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
          {profileMessages.tabs.account}
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <KeyRound className="h-4 w-4" />
          {profileMessages.tabs.security}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="mt-6">
        <div className="panel-glass p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-fg">
              {profileMessages.account.title}
            </h2>
            <p className="text-sm text-muted mt-1">
              {profileMessages.account.description}
            </p>
          </div>
          <ProfileForm user={user} onUpdated={onUpdated} />
        </div>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 panel-glass p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-fg">
                {profileMessages.security.title}
              </h2>
              <p className="text-sm text-muted mt-1">
                {profileMessages.security.description}
              </p>
            </div>
            <ChangePasswordForm />
          </div>

          <aside className="panel-glass p-5 h-fit space-y-4">
            <h3 className="text-sm font-semibold text-fg">
              {profileMessages.security.tipsTitle}
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                {profileMessages.security.tip1}
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                {profileMessages.security.tip2}
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                {profileMessages.security.tip3}
              </li>
            </ul>
          </aside>
        </div>
      </TabsContent>
    </Tabs>
  );
}
