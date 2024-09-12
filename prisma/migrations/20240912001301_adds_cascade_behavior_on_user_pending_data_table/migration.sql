-- DropForeignKey
ALTER TABLE "(user_pending_data)" DROP CONSTRAINT "(user_pending_data)_user_id_fkey";

-- AddForeignKey
ALTER TABLE "(user_pending_data)" ADD CONSTRAINT "(user_pending_data)_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
