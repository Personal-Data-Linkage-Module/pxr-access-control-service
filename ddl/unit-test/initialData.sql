/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
-- 対象テーブルのデータをすべて削除
DELETE FROM pxr_access_control.caller_role;
DELETE FROM pxr_access_control.api_access_permission;
DELETE FROM pxr_access_control.api_token;

-- 対象テーブルのシーケンスを初期化
SELECT SETVAL('pxr_access_control.api_access_permission_id_seq', 1, false);
SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
SELECT SETVAL('pxr_access_control.caller_role_id_seq', 1, false);
