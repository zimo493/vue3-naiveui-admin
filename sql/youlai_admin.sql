
# YouLai_Admin 数据库(MySQL 5.7 ~ MySQL 8.x)
# Copyright (c) 2021-present, youlai.tech


-- ----------------------------
-- 1. 创建数据库
-- ----------------------------
CREATE DATABASE IF NOT EXISTS youlai_admin CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;


-- ----------------------------
-- 2. 创建表 && 数据初始化
-- ----------------------------
USE youlai_admin;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for gen_table
-- ----------------------------
DROP TABLE IF EXISTS `gen_table`;
CREATE TABLE `gen_table` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `table_name` varchar(100) NOT NULL COMMENT '表名',
    `module_name` varchar(100) COMMENT '模块名',
    `package_name` varchar(255) NOT NULL COMMENT '包名',
    `business_name` varchar(100) NOT NULL COMMENT '业务名',
    `entity_name` varchar(100) NOT NULL COMMENT '实体类名',
    `author` varchar(50) NOT NULL COMMENT '作者',
    `parent_menu_id` bigint COMMENT '上级菜单ID，对应sys_menu的id ',
    `remove_table_prefix` varchar(20) COMMENT '要移除的表前缀，如: sys_',
    `page_type` varchar(20) COMMENT '页面类型(classic|curd)',
    `create_time` datetime COMMENT '创建时间',
    `update_time` datetime COMMENT '更新时间',
    `is_deleted` tinyint(4) DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tablename` (`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代码生成配置表';

-- ----------------------------
-- Table structure for gen_table_column
-- ----------------------------
DROP TABLE IF EXISTS `gen_table_column`;
CREATE TABLE `gen_table_column` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `table_id` bigint NOT NULL COMMENT '关联的表配置ID',
    `column_name` varchar(100),
    `column_type` varchar(50),
    `column_length` int,
    `field_name` varchar(100) NOT NULL COMMENT '字段名称',
    `field_type` varchar(100) COMMENT '字段类型',
    `field_sort` int COMMENT '字段排序',
    `field_comment` varchar(255) COMMENT '字段描述',
    `max_length` int,
    `is_required` tinyint(1) COMMENT '是否必填',
    `is_show_in_list` tinyint(1) DEFAULT '0' COMMENT '是否在列表显示',
    `is_show_in_form` tinyint(1) DEFAULT '0' COMMENT '是否在表单显示',
    `is_show_in_query` tinyint(1) DEFAULT '0' COMMENT '是否在查询条件显示',
    `query_type` tinyint COMMENT '查询方式',
    `form_type` tinyint COMMENT '表单类型',
    `dict_type` varchar(50) COMMENT '字典类型',
    `create_time` datetime COMMENT '创建时间',
    `update_time` datetime COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_table_id` (`table_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代码生成字段配置表';

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `config_name` varchar(50) NOT NULL COMMENT '配置名称',
    `config_key` varchar(50) NOT NULL COMMENT '配置key',
    `config_value` varchar(100) NOT NULL COMMENT '配置值',
    `remark` varchar(255) COMMENT '备注',
    `create_time` datetime COMMENT '创建时间',
    `create_by` bigint COMMENT '创建人ID',
    `update_time` datetime COMMENT '更新时间',
    `update_by` bigint COMMENT '更新人ID',
    `is_deleted` tinyint(4) DEFAULT '0' NOT NULL COMMENT '逻辑删除标识(0-未删除 1-已删除)',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='系统配置表';

-- ----------------------------
-- Records of sys_config
-- ----------------------------
INSERT INTO `sys_config` VALUES (1, '系统限流QPS', 'IP_QPS_THRESHOLD_LIMIT', '10', '单个IP请求的最大每秒查询数（QPS）阈值Key', now(), 1, NULL, NULL, 0);

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
    `name` varchar(100) NOT NULL COMMENT '部门名称',
    `code` varchar(100) NOT NULL COMMENT '部门编号',
    `parent_id` bigint DEFAULT 0 COMMENT '父节点id',
    `tree_path` varchar(255) NOT NULL COMMENT '父节点id路径',
    `sort` smallint DEFAULT 0 COMMENT '显示顺序',
    `status` tinyint DEFAULT 1 COMMENT '状态(1-正常 0-禁用)',
    `create_by` bigint NULL COMMENT '创建人ID',
    `create_time` datetime NULL COMMENT '创建时间',
    `update_by` bigint NULL COMMENT '修改人ID',
    `update_time` datetime NULL COMMENT '更新时间',
    `is_deleted` tinyint DEFAULT 0 COMMENT '逻辑删除标识(1-已删除 0-未删除)',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `uk_code`(`code` ASC) USING BTREE COMMENT '部门编号唯一索引'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COMMENT = '部门管理表';

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (1, '有来技术', 'YOULAI', 0, '0', 1, 1, 1, NULL, 1, now(), 0);
INSERT INTO `sys_dept` VALUES (2, '研发部门', 'RD001', 1, '0,1', 1, 1, 2, NULL, 2, now(), 0);
INSERT INTO `sys_dept` VALUES (3, '测试部门', 'QA001', 1, '0,1', 2, 1, 2, NULL, 2, now(), 0);

-- ----------------------------
-- Table structure for sys_dict
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE `sys_dict` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键 ',
    `dict_code` varchar(50) COMMENT '类型编码',
    `name` varchar(50) COMMENT '类型名称',
    `status` tinyint(1) DEFAULT '0' COMMENT '状态(0:正常;1:禁用)',
    `remark` varchar(255) COMMENT '备注',
    `create_time` datetime COMMENT '创建时间',
    `create_by` bigint COMMENT '创建人ID',
    `update_time` datetime COMMENT '更新时间',
    `update_by` bigint COMMENT '修改人ID',
    `is_deleted` tinyint DEFAULT '0' COMMENT '是否删除(1-删除，0-未删除)',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_dict_code` (`dict_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据字典类型表';

-- ----------------------------
-- Records of sys_dict
-- ----------------------------
INSERT INTO `sys_dict` VALUES (1, 'gender', '性别', 1, NULL, now(), 1, now(), 1, 0);
INSERT INTO `sys_dict` VALUES (2, 'notice_type', '通知类型', 1, NULL, now(), 1, now(), 1, 0);
INSERT INTO `sys_dict` VALUES (3, 'notice_level', '通知级别', 1, NULL, now(), 1, now(), 1, 0);

-- ----------------------------
-- Table structure for sys_dict_item
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_item`;
CREATE TABLE `sys_dict_item` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
    `dict_code` varchar(50) COMMENT '关联字典编码，与sys_dict表中的dict_code对应',
    `value` varchar(50) COMMENT '字典项值',
    `label` varchar(100) COMMENT '字典项标签',
    `tag_type` varchar(50) COMMENT '标签类型，用于前端样式展示（如success、warning等）',
    `status` tinyint DEFAULT '0' COMMENT '状态（1-正常，0-禁用）',
    `sort` int DEFAULT '0' COMMENT '排序',
    `remark` varchar(255) COMMENT '备注',
    `create_time` datetime COMMENT '创建时间',
    `create_by` bigint COMMENT '创建人ID',
    `update_time` datetime COMMENT '更新时间',
    `update_by` bigint COMMENT '修改人ID',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据字典项表';

-- ----------------------------
-- Records of sys_dict_item
-- ----------------------------
INSERT INTO `sys_dict_item` VALUES (1, 'gender', '1', '男', 'primary', 1, 1, NULL, now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (2, 'gender', '2', '女', 'error', 1, 2, NULL, now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (3, 'gender', '0', '保密', '', 1, 3, NULL, now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (4, 'notice_type', '1', '系统升级', 'success', 1, 1, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (5, 'notice_type', '2', '系统维护', 'primary', 1, 2, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (6, 'notice_type', '3', '安全警告', 'error', 1, 3, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (7, 'notice_type', '4', '假期通知', 'success', 1, 4, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (8, 'notice_type', '5', '公司新闻', 'primary', 1, 5, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (9, 'notice_type', '99', '其他', 'info', 1, 99, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (10, 'notice_level', 'L', '低', 'info', 1, 1, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (11, 'notice_level', 'M', '中', 'warning', 1, 2, '', now(), 1, now(), 1);
INSERT INTO `sys_dict_item` VALUES (12, 'notice_level', 'H', '高', 'error', 1, 3, '', now(), 1, now(), 1);
-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `module` TINYINT NOT NULL COMMENT '模块，数字枚举，参考 LogModule 枚举',
    `action_type` TINYINT NOT NULL COMMENT '操作类型，数字枚举，参考 ActionType 枚举',
    `title` VARCHAR(100) NOT NULL COMMENT '前端显示标题',
    `content` TEXT COMMENT '自定义日志内容',
    `operator_id` BIGINT NOT NULL COMMENT '操作人ID',
    `operator_name` VARCHAR(50) COMMENT '操作人名称',
    `request_uri` VARCHAR(255) COMMENT '请求路径',
    `request_method` VARCHAR(10) COMMENT '请求方法',
    `ip` VARCHAR(45) COMMENT 'IP地址',
    `province` VARCHAR(100) COMMENT '省份',
    `city` VARCHAR(100) COMMENT '城市',
    `device` VARCHAR(100) COMMENT '设备',
    `os` VARCHAR(100) COMMENT '操作系统',
    `browser` VARCHAR(100) COMMENT '浏览器',
    `status` TINYINT DEFAULT 1 COMMENT '0失败 1成功',
    `error_msg` VARCHAR(255) COMMENT '错误信息',
    `execution_time` INT COMMENT '执行时间(ms)',
    `create_time` DATETIME COMMENT '操作时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_module_action_time` (`module`, `action_type`, `create_time`),
    KEY `idx_operator_time` (`operator_id`, `create_time`),
    KEY `idx_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统操作日志表';

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `parent_id` bigint NOT NULL COMMENT '父菜单ID',
    `tree_path` varchar(255) COMMENT '父节点ID路径',
    `name` varchar(64) NOT NULL COMMENT '菜单名称',
    `type` char(1) NOT NULL COMMENT '菜单类型（C-目录 M-菜单 B-按钮）',
    `route_name` varchar(255) COMMENT '路由名称（Vue Router 中用于命名路由）',
    `route_path` varchar(128) COMMENT '路由路径（Vue Router 中定义的 URL 路径）',
    `component` varchar(128) COMMENT '组件路径（组件页面完整路径，相对于 src/views/，缺省后缀 .vue）',
    `perm` varchar(128) COMMENT '【按钮】权限标识',
    `always_show` tinyint DEFAULT '0' COMMENT '【目录】只有一个子路由是否始终显示（1-是 0-否）',
    `keep_alive` tinyint DEFAULT '0' COMMENT '【菜单】是否开启页面缓存（1-是 0-否）',
    `visible` tinyint(1) DEFAULT '1' COMMENT '显示状态（1-显示 0-隐藏）',
    `sort` int DEFAULT '0' COMMENT '排序',
    `icon` varchar(64) COMMENT '菜单图标',
    `redirect` varchar(128) COMMENT '跳转路径',
    `create_time` datetime COMMENT '创建时间',
    `update_time` datetime COMMENT '更新时间',
    `params` json COMMENT '路由参数',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单管理表';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------

-- 顶级目录（100~900，步进 100）系统管理/系统工具/数据大屏/平台文档/接口文档/组件封装/功能演示/多级菜单/路由参数
INSERT INTO `sys_menu` VALUES (100, 0, '0', '系统管理', 'C', '', '/system', 'Layout', NULL, NULL, NULL, 1, 1, 'material-symbols:jamboard-kiosk', '/system/user', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (200, 0, '0', '系统工具', 'C', '', '/utils', 'Layout', NULL, NULL, NULL, 1, 2, 'ep:menu', '', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (300, 0, '0', '数据大屏', 'C', '', '/dashboard', 'Layout', NULL, NULL, NULL, 1, 3, 'ant-design:dashboard-filled', '', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (400, 0, '0', '平台文档', 'C', '', '/doc', 'Layout', NULL, NULL, NULL, 1, 4, 'icon-park-solid:file-code', '', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (500, 0, '0', '接口文档', 'C', '', '/api', 'Layout', NULL, NULL, NULL, 1, 5, 'simple-icons:apifox', '', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (600, 0, '0', '组件封装', 'C', '', '/component', 'Layout', NULL, NULL, NULL, 1, 6, 'ep:menu', '', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (700, 0, '0', '功能演示', 'C', '', '/function', 'Layout', NULL, NULL, NULL, 1, 7, 'mdi:laptop', '', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (800, 0, '0', '多级菜单', 'C', '', '/multi-level', 'Layout', NULL, 1, NULL, 1, 8, 'bi:123', '', now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (900, 0, '0', '路由参数', 'C', '', '/route-param', 'Layout', NULL, NULL, NULL, 1, 9, 'icon-park-outline:router', '', now(), now(), NULL);


-- 系统管理（100），二级菜单步进 10
INSERT INTO `sys_menu` VALUES (110, 100, '0,100', '用户管理', 'M', 'User', 'user', 'system/user/index', NULL, NULL, 1, 1, 1, 'ep:user-filled', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (111, 110, '0,100,110', '用户查询', 'B', NULL, '', NULL, 'sys:user:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (112, 110, '0,100,110', '用户新增', 'B', NULL, '', NULL, 'sys:user:create', NULL, NULL, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (113, 110, '0,100,110', '用户编辑', 'B', NULL, '', NULL, 'sys:user:update', NULL, NULL, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (114, 110, '0,100,110', '用户删除', 'B', NULL, '', NULL, 'sys:user:delete', NULL, NULL, 1, 4, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (115, 110, '0,100,110', '重置密码', 'B', NULL, '', NULL, 'sys:user:reset-password', NULL, NULL, 1, 5, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (116, 110, '0,100,110', '用户导入', 'B', NULL, '', NULL, 'sys:user:import', NULL, NULL, 1, 6, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (117, 110, '0,100,110', '用户导出', 'B', NULL, '', NULL, 'sys:user:export', NULL, NULL, 1, 7, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (120, 100, '0,100', '角色管理', 'M', 'Role', 'role', 'system/role/index', NULL, NULL, 1, 1, 2, 'eos-icons:role-binding', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (121, 120, '0,100,120', '角色查询', 'B', NULL, '', NULL, 'sys:role:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (122, 120, '0,100,120', '角色新增', 'B', NULL, '', NULL, 'sys:role:create', NULL, NULL, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (123, 120, '0,100,120', '角色编辑', 'B', NULL, '', NULL, 'sys:role:update', NULL, NULL, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (124, 120, '0,100,120', '角色删除', 'B', NULL, '', NULL, 'sys:role:delete', NULL, NULL, 1, 4, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (125, 120, '0,100,120', '数据权限', 'B', NULL, '', NULL, 'sys:role:assign', NULL, NULL, 1, 5, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (130, 100, '0,100', '菜单管理', 'M', 'SysMenu', 'menu', 'system/menu/index', NULL, NULL, 1, 1, 3, 'ep:menu', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (131, 130, '0,100,130', '菜单查询', 'B', NULL, '', NULL, 'sys:menu:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (132, 130, '0,100,130', '菜单新增', 'B', NULL, '', NULL, 'sys:menu:create', NULL, NULL, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (133, 130, '0,100,130', '菜单编辑', 'B', NULL, '', NULL, 'sys:menu:update', NULL, NULL, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (134, 130, '0,100,130', '菜单删除', 'B', NULL, '', NULL, 'sys:menu:delete', NULL, NULL, 1, 4, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (140, 100, '0,100', '部门管理', 'M', 'Dept', 'dept', 'system/dept/index', NULL, NULL, 1, 1, 4, 'icon-park-solid:network-tree', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (141, 140, '0,100,140', '部门查询', 'B', NULL, '', NULL, 'sys:dept:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (142, 140, '0,100,140', '部门新增', 'B', NULL, '', NULL, 'sys:dept:create', NULL, NULL, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (143, 140, '0,100,140', '部门编辑', 'B', NULL, '', NULL, 'sys:dept:update', NULL, NULL, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (144, 140, '0,100,140', '部门删除', 'B', NULL, '', NULL, 'sys:dept:delete', NULL, NULL, 1, 4, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (150, 100, '0,100', '字典管理', 'M', 'Dict', 'dict', 'system/dict/index', NULL, NULL, 1, 1, 5, 'streamline:dictionary-language-book-solid', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (151, 150, '0,100,150', '字典查询', 'B', NULL, '', NULL, 'sys:dict:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (152, 150, '0,100,150', '字典新增', 'B', NULL, '', NULL, 'sys:dict:create', NULL, NULL, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (153, 150, '0,100,150', '字典编辑', 'B', NULL, '', NULL, 'sys:dict:update', NULL, NULL, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (154, 150, '0,100,150', '字典删除', 'B', NULL, '', NULL, 'sys:dict:delete', NULL, NULL, 1, 4, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (160, 100, '0,100', '字典项', 'M', 'DictItem', 'dict-item', 'system/dict/dict-item', NULL, 0, 1, 0, 6, 'icon-park-outline:ad-product', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (161, 160, '0,100,160', '字典项查询', 'B', NULL, '', NULL, 'sys:dict-item:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (162, 160, '0,100,160', '字典项新增', 'B', NULL, '', NULL, 'sys:dict-item:create', NULL, NULL, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (163, 160, '0,100,160', '字典项编辑', 'B', NULL, '', NULL, 'sys:dict-item:update', NULL, NULL, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (164, 160, '0,100,160', '字典项删除', 'B', NULL, '', NULL, 'sys:dict-item:delete', NULL, NULL, 1, 4, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (170, 100, '0,100', '系统日志', 'M', 'Log', 'log', 'system/log/index', NULL, 0, 1, 1, 7, 'icon-park-solid:log', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (171, 170, '0,100,170', '日志查询', 'B', NULL, '', NULL, 'sys:log:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (180, 100, '0,100', '系统配置', 'M', 'Config', 'config', 'system/config/index', NULL, 0, 1, 1, 8, 'file-icons:config-coffeescript', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (181, 180, '0,100,180', '系统配置查询', 'B', NULL, '', NULL, 'sys:config:list', 0, 1, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (182, 180, '0,100,180', '系统配置新增', 'B', NULL, '', NULL, 'sys:config:create', 0, 1, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (183, 180, '0,100,180', '系统配置修改', 'B', NULL, '', NULL, 'sys:config:update', 0, 1, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (184, 180, '0,100,180', '系统配置删除', 'B', NULL, '', NULL, 'sys:config:delete', 0, 1, 1, 4, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (185, 180, '0,100,180', '系统配置刷新', 'B', NULL, '', NULL, 'sys:config:refresh', 0, 1, 1, 5, '', NULL, now(), now(), NULL);

INSERT INTO `sys_menu` VALUES (190, 100, '0,100', '通知公告', 'M', 'Notice', 'notice', 'system/notice/index', NULL, NULL, NULL, 1, 9, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (191, 190, '0,100,190', '通知查询', 'B', NULL, '', NULL, 'sys:notice:list', NULL, NULL, 1, 1, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (192, 190, '0,100,190', '通知新增', 'B', NULL, '', NULL, 'sys:notice:create', NULL, NULL, 1, 2, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (193, 190, '0,100,190', '通知编辑', 'B', NULL, '', NULL, 'sys:notice:update', NULL, NULL, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (194, 190, '0,100,190', '通知删除', 'B', NULL, '', NULL, 'sys:notice:delete', NULL, NULL, 1, 4, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (195, 190, '0,100,190', '通知发布', 'B', NULL, '', NULL, 'sys:notice:publish', 0, 1, 1, 5, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (196, 190, '0,100,190', '通知撤回', 'B', NULL, '', NULL, 'sys:notice:revoke', 0, 1, 1, 6, '', NULL, now(), now(), NULL);


-- 系统工具（200）
INSERT INTO `sys_menu` VALUES (210, 200, '0,200', '代码生成', 'M', 'Codegen', 'codegen', 'codegen/index', NULL, NULL, 1, 1, 1, 'ant-design:code-filled', NULL, now(), now(), NULL);


-- 数据大屏（300）
INSERT INTO `sys_menu` VALUES (310, 300, '0,300', '大屏适配', 'M', 'FitScreen', 'http://localhost:5173/#/fitScreen', NULL, NULL, 0, 1, 1, 1, 'icon-park-solid:monitor-one', NULL, now(), now(), NULL);


-- 平台文档（400）
INSERT INTO `sys_menu` VALUES (410, 400, '0,400', '平台文档(外链)', 'M', 'PlatformDoc', 'https://juejin.cn/post/7228990409909108793', '', NULL, NULL, NULL, 1, 1, 'local:vitepress', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (420, 400, '0,400', '后端文档', 'M', 'BackendDoc', 'https://youlai.blog.csdn.net/article/details/145178880', '', NULL, NULL, NULL, 1, 2, 'local:csdn', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (430, 400, '0,400', '移动端文档', 'M', 'MobileDoc', 'https://youlai.blog.csdn.net/article/details/143222890', '', NULL, NULL, NULL, 1, 3, 'local:csdn', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (440, 400, '0,400', '内部文档', 'M', 'InternalDoc', 'internal-doc', 'demo/internal-doc', NULL, NULL, NULL, 1, 4, 'local:juejin', NULL, now(), now(), NULL);


-- 接口文档（500）
INSERT INTO `sys_menu` VALUES (510, 500, '0,500', 'Apifox', 'M', 'Apifox', 'apifox', 'demo/api/apifox', NULL, NULL, 1, 1, 1, 'local:apifox', NULL, now(), now(), NULL);


-- 组件封装（600）
INSERT INTO `sys_menu` VALUES (610, 600, '0,600', 'Cron表达式生成器', 'M', 'Cron', 'cron', 'demo/cron', NULL, NULL, 1, 1, 1, 'icon-park-outline:timer', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (620, 600, '0,600', '富文本编辑器', 'M', 'WangEditor', 'wang-editor', 'demo/wang-editor', NULL, NULL, 1, 1, 2, 'icon-park-outline:edit', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (630, 600, '0,600', '图片上传', 'M', 'Upload', 'upload', 'demo/upload', NULL, NULL, 1, 1, 3, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (640, 600, '0,600', '图标选择器', 'M', 'IconSelector', 'icon-selector', 'demo/icon-selector', NULL, NULL, 1, 1, 4, 'emojione-v1:smiling-face-with-sunglasses', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (650, 600, '0,600', '字典组件', 'M', 'Dictionary', 'dict-demo', 'demo/dictionary', NULL, NULL, 1, 1, 5, '', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (660, 600, '0,600', '增删改查', 'M', 'Curd', 'curd', 'demo/curd/index', NULL, NULL, 1, 1, 0, '', NULL, now(), now(), NULL);


-- 功能演示（700）
INSERT INTO `sys_menu` VALUES (710, 700, '0,700', 'Icons', 'M', 'Icon', 'icon-demo', 'demo/icons', NULL, NULL, 1, 1, 1, 'noto:grinning-face', NULL, now(), now(), NULL);


-- 多级菜单（800）— 含三层嵌套
INSERT INTO `sys_menu` VALUES (810, 800, '0,800', '菜单一级', 'C', 'Multilevel1', 'multi-level1', 'Layout', NULL, 1, 1, 1, 1, 'healthicons:1', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (811, 810, '0,800,810', '菜单二级', 'C', 'Multilevel2', 'multi-level2', 'Layout', NULL, 0, 1, 1, 1, 'healthicons:2', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (812, 811, '0,800,810,811', '菜单三级-1', 'M', 'Multilevel31', 'multi-level3-1', 'demo/multi-level/children/children/level3-1', NULL, 0, 1, 1, 1, 'healthicons:3', NULL, now(), now(), NULL);
INSERT INTO `sys_menu` VALUES (813, 811, '0,800,810,811', '菜单三级-2', 'M', 'Multilevel32', 'multi-level3-2', 'demo/multi-level/children/children/level3-2', NULL, 0, 0, 1, 2, 'healthicons:3', NULL, now(), now(), NULL);


-- 路由参数（900）
INSERT INTO `sys_menu` VALUES (910, 900, '0,900', '参数(type=1)', 'M', 'RouteParamType1', 'route-param-type1', 'demo/route-param', NULL, 0, 1, 1, 1, 'icon-park-outline:star', NULL, now(), now(), '{"type":"1"}');
INSERT INTO `sys_menu` VALUES (920, 900, '0,900', '参数(type=2)', 'M', 'RouteParamType2', 'route-param-type2', 'demo/route-param', NULL, 0, 1, 1, 2, 'icon-park-solid:star', NULL, now(), now(), '{"type":"2"}');

-- ----------------------------
-- Table structure for sys_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE `sys_notice` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `title` varchar(50) COMMENT '通知标题',
    `content` text COMMENT '通知内容',
    `type` tinyint NOT NULL COMMENT '通知类型（关联字典编码：notice_type）',
    `level` varchar(5) NOT NULL COMMENT '通知等级（字典code：notice_level）',
    `target_type` tinyint NOT NULL COMMENT '目标类型（1: 全体, 2: 指定）',
    `target_user_ids` varchar(255) COMMENT '目标人ID集合（多个使用英文逗号,分割）',
    `publisher_id` bigint COMMENT '发布人ID',
    `publish_status` tinyint DEFAULT '0' COMMENT '发布状态（0: 未发布, 1: 已发布, -1: 已撤回）',
    `publish_time` datetime COMMENT '发布时间',
    `revoke_time` datetime COMMENT '撤回时间',
    `create_by` bigint NOT NULL COMMENT '创建人ID',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    `update_by` bigint COMMENT '更新人ID',
    `update_time` datetime COMMENT '更新时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除（0: 未删除, 1: 已删除）',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统通知公告表';

-- ----------------------------
-- Records of sys_notice
-- ----------------------------
INSERT INTO `sys_notice` VALUES (1, 'v2.12.0 新增系统日志，访问趋势统计功能。', '<p>1. 消息通知</p><p>2. 字典重构</p><p>3. 代码生成</p>', 1, 'L', 1, '2', 1, 1, now(), now(), 2, now(), 1, now(), 0);
INSERT INTO `sys_notice` VALUES (2, 'v2.13.0 新增菜单搜索。', '<p>1. 消息通知</p><p>2. 字典重构</p><p>3. 代码生成</p>', 1, 'L', 1, '2', 1, 1, now(), now(), 2, now(), 1, now(), 0);
INSERT INTO `sys_notice` VALUES (3, 'v2.14.0 新增个人中心。', '<p>1. 消息通知</p><p>2. 字典重构</p><p>3. 代码生成</p>', 1, 'L', 1, '2', 2, 1, now(), now(), 2, now(), 2, now(), 0);
INSERT INTO `sys_notice` VALUES (4, 'v2.15.0 登录页面改造。', '<p>1. 消息通知</p><p>2. 字典重构</p><p>3. 代码生成</p>', 1, 'L', 1, '2', 2, 1, now(), now(), 2, now(), 2, now(), 0);
INSERT INTO `sys_notice` VALUES (5, 'v2.16.0 通知公告、字典翻译组件。', '<p>1. 消息通知</p><p>2. 字典重构</p><p>3. 代码生成</p>', 1, 'L', 1, '2', 2, 1, now(), now(), 2, now(), 2, now(), 0);

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(64) NOT NULL COMMENT '角色名称',
    `code` varchar(32) NOT NULL COMMENT '角色编码',
    `sort` int COMMENT '显示顺序',
    `status` tinyint(1) DEFAULT '1' COMMENT '角色状态(1-正常 0-停用)',
    `data_scope` tinyint COMMENT '数据权限(1-所有数据 2-部门及子部门数据 3-本部门数据 4-本人数据 5-自定义部门数据)',
    `create_by` bigint COMMENT '创建人 ID',
    `create_time` datetime COMMENT '创建时间',
    `update_by` bigint COMMENT '更新人ID',
    `update_time` datetime COMMENT '更新时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除标识(0-未删除 1-已删除)',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `uk_name`(`name` ASC) USING BTREE COMMENT '角色名称唯一索引',
    UNIQUE INDEX `uk_code`(`code` ASC) USING BTREE COMMENT '角色编码唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '超级管理员', 'ROOT', 1, 1, 1, NULL, now(), NULL, now(), 0);
INSERT INTO `sys_role` VALUES (2, '系统管理员', 'ADMIN', 2, 1, 1, NULL, now(), NULL, NULL, 0);
INSERT INTO `sys_role` VALUES (3, '访问游客', 'GUEST', 3, 1, 3, NULL, now(), NULL, now(), 0);
INSERT INTO `sys_role` VALUES (4, '部门主管', 'DEPT_MANAGER', 4, 1, 2, NULL, now(), NULL, now(), 0);
INSERT INTO `sys_role` VALUES (5, '部门成员', 'DEPT_MEMBER', 5, 1, 3, NULL, now(), NULL, now(), 0);
INSERT INTO `sys_role` VALUES (6, '普通员工', 'EMPLOYEE', 6, 1, 4, NULL, now(), NULL, now(), 0);
INSERT INTO `sys_role` VALUES (7, '自定义权限用户', 'CUSTOM_USER', 7, 1, 5, NULL, now(), NULL, now(), 0);

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
    `role_id` bigint NOT NULL COMMENT '角色ID',
    `menu_id` bigint NOT NULL COMMENT '菜单ID',
    UNIQUE KEY `uk_roleid_menuid` (`role_id`, `menu_id`) COMMENT '角色菜单唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色和菜单关联表';

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept` (
    `role_id` bigint NOT NULL COMMENT '角色ID',
    `dept_id` bigint NOT NULL COMMENT '部门ID',
    UNIQUE KEY `uk_roleid_deptid` (`role_id`, `dept_id`) COMMENT '角色部门唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色部门关联表';

-- ----------------------------
-- Records of sys_role_dept
-- ----------------------------
INSERT IGNORE INTO `sys_role_dept` VALUES (7, 1);
INSERT IGNORE INTO `sys_role_dept` VALUES (7, 2);

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------

-- 系统管理员（role_id=2）
-- 顶级目录
INSERT INTO `sys_role_menu` VALUES (2, 100), (2, 200), (2, 300), (2, 400), (2, 500), (2, 600), (2, 700), (2, 800), (2, 900);
-- 系统管理 - 用户管理
INSERT INTO `sys_role_menu` VALUES (2, 110), (2, 111), (2, 112), (2, 113), (2, 114), (2, 115), (2, 116), (2, 117);
-- 系统管理 - 角色管理
INSERT INTO `sys_role_menu` VALUES (2, 120), (2, 121), (2, 122), (2, 123), (2, 124), (2, 125);
-- 系统管理 - 菜单管理
INSERT INTO `sys_role_menu` VALUES (2, 130), (2, 131), (2, 132), (2, 133), (2, 134);
-- 系统管理 - 部门管理
INSERT INTO `sys_role_menu` VALUES (2, 140), (2, 141), (2, 142), (2, 143), (2, 144);
-- 系统管理 - 字典管理
INSERT INTO `sys_role_menu` VALUES (2, 150), (2, 151), (2, 152), (2, 153), (2, 154);
-- 系统管理 - 字典项
INSERT INTO `sys_role_menu` VALUES (2, 160), (2, 161), (2, 162), (2, 163), (2, 164);
-- 系统管理 - 系统日志
INSERT INTO `sys_role_menu` VALUES (2, 170), (2, 171);
-- 系统管理 - 系统配置
INSERT INTO `sys_role_menu` VALUES (2, 180), (2, 181), (2, 182), (2, 183), (2, 184), (2, 185);
-- 系统管理 - 通知公告
INSERT INTO `sys_role_menu` VALUES (2, 190), (2, 191), (2, 192), (2, 193), (2, 194), (2, 195), (2, 196);
-- 系统工具
INSERT INTO `sys_role_menu` VALUES (2, 210);
-- 数据大屏
INSERT INTO `sys_role_menu` VALUES (2, 310);
-- 平台文档
INSERT INTO `sys_role_menu` VALUES (2, 410), (2, 420), (2, 430), (2, 440);
-- 接口文档
INSERT INTO `sys_role_menu` VALUES (2, 510);
-- 组件封装
INSERT INTO `sys_role_menu` VALUES (2, 610), (2, 620), (2, 630), (2, 640), (2, 650), (2, 660);
-- 功能演示
INSERT INTO `sys_role_menu` VALUES (2, 710);
-- 多级菜单
INSERT INTO `sys_role_menu` VALUES (2, 810), (2, 811), (2, 812), (2, 813);
-- 路由参数
INSERT INTO `sys_role_menu` VALUES (2, 910), (2, 920);

-- 部门主管（role_id=4）
INSERT IGNORE INTO `sys_role_menu` VALUES (4, 100);
INSERT IGNORE INTO `sys_role_menu` VALUES (4, 110), (4, 111), (4, 112), (4, 113), (4, 114), (4, 115), (4, 116), (4, 117);
INSERT IGNORE INTO `sys_role_menu` VALUES (4, 120), (4, 121), (4, 122), (4, 123), (4, 124);

-- 部门成员（role_id=5）
INSERT IGNORE INTO `sys_role_menu` VALUES (5, 100);
INSERT IGNORE INTO `sys_role_menu` VALUES (5, 110), (5, 111), (5, 112), (5, 113), (5, 114), (5, 115), (5, 116), (5, 117);
INSERT IGNORE INTO `sys_role_menu` VALUES (5, 120), (5, 121), (5, 122), (5, 123), (5, 124);

-- 普通员工（role_id=6）
INSERT IGNORE INTO `sys_role_menu` VALUES (6, 100);
INSERT IGNORE INTO `sys_role_menu` VALUES (6, 110), (6, 111), (6, 112), (6, 113), (6, 114), (6, 115), (6, 116), (6, 117);
INSERT IGNORE INTO `sys_role_menu` VALUES (6, 120), (6, 121), (6, 122), (6, 123), (6, 124);

-- 自定义权限用户（role_id=7）
INSERT IGNORE INTO `sys_role_menu` VALUES (7, 100);
INSERT IGNORE INTO `sys_role_menu` VALUES (7, 110), (7, 111), (7, 112), (7, 113), (7, 114), (7, 115), (7, 116), (7, 117);
INSERT IGNORE INTO `sys_role_menu` VALUES (7, 120), (7, 121), (7, 122), (7, 123), (7, 124);

-- 访问游客（role_id=3）
INSERT IGNORE INTO `sys_role_menu` VALUES (3, 700);
INSERT IGNORE INTO `sys_role_menu` VALUES (3, 710);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `username` varchar(64) COMMENT '用户名',
    `nickname` varchar(64) COMMENT '昵称',
    `gender` tinyint(1) DEFAULT '1' COMMENT '性别((1-男 2-女 0-保密)',
    `password` varchar(100) COMMENT '密码',
    `dept_id` int COMMENT '部门ID',
    `avatar` varchar(255) COMMENT '用户头像',
    `mobile` varchar(20) COMMENT '联系方式',
    `status` tinyint(1) DEFAULT '1' COMMENT '状态(1-正常 0-禁用)',
    `email` varchar(128) COMMENT '用户邮箱',
    `create_time` datetime COMMENT '创建时间',
    `create_by` bigint COMMENT '创建人ID',
    `update_time` datetime COMMENT '更新时间',
    `update_by` bigint COMMENT '修改人ID',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除标识(0-未删除 1-已删除)',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_username` (`username`) COMMENT '用户名唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'root', '有来技术', 0, '$2a$10$xVWsNOhHrCxh5UbpCE7/HuJ.PAOKcYAqRxD2CO2nVnJS.IAXkr5aq', NULL, 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif', '18812345677', 1, 'youlaitech@163.com', now(), NULL, now(), NULL, 0);
INSERT INTO `sys_user` VALUES (2, 'admin', '系统管理员', 1, '$2a$10$xVWsNOhHrCxh5UbpCE7/HuJ.PAOKcYAqRxD2CO2nVnJS.IAXkr5aq', 1, 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif', '18888888888', 1, 'youlaitech@163.com', now(), NULL, now(), NULL, 0);
INSERT INTO `sys_user` VALUES (3, 'test', '测试小用户', 1, '$2a$10$xVWsNOhHrCxh5UbpCE7/HuJ.PAOKcYAqRxD2CO2nVnJS.IAXkr5aq', 3, 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif', '18812345679', 1, 'youlaitech@163.com', now(), NULL, now(), NULL, 0);
INSERT INTO `sys_user` VALUES (4, 'dept_manager', '部门主管', 1, '$2a$10$xVWsNOhHrCxh5UbpCE7/HuJ.PAOKcYAqRxD2CO2nVnJS.IAXkr5aq', 1, 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif', '18812345680', 1, 'manager@youlaitech.com', now(), NULL, now(), NULL, 0);
INSERT INTO `sys_user` VALUES (5, 'dept_member', '部门成员', 1, '$2a$10$xVWsNOhHrCxh5UbpCE7/HuJ.PAOKcYAqRxD2CO2nVnJS.IAXkr5aq', 1, 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif', '18812345681', 1, 'member@youlaitech.com', now(), NULL, now(), NULL, 0);
INSERT INTO `sys_user` VALUES (6, 'employee', '普通员工', 1, '$2a$10$xVWsNOhHrCxh5UbpCE7/HuJ.PAOKcYAqRxD2CO2nVnJS.IAXkr5aq', 2, 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif', '18812345682', 1, 'employee@youlaitech.com', now(), NULL, now(), NULL, 0);
INSERT INTO `sys_user` VALUES (7, 'custom_user', '自定义权限用户', 1, '$2a$10$xVWsNOhHrCxh5UbpCE7/HuJ.PAOKcYAqRxD2CO2nVnJS.IAXkr5aq', 3, 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif', '18812345683', 1, 'custom@youlaitech.com', now(), NULL, now(), NULL, 0);

-- ----------------------------
-- Table structure for sys_user_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_notice`;
CREATE TABLE `sys_user_notice` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
    `notice_id` bigint NOT NULL COMMENT '公共通知id',
    `user_id` bigint NOT NULL COMMENT '用户id',
    `is_read` tinyint DEFAULT '0' COMMENT '读取状态（0: 未读, 1: 已读）',
    `read_time` datetime COMMENT '阅读时间',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    `update_time` datetime COMMENT '更新时间',
    `is_deleted` tinyint DEFAULT '0' COMMENT '逻辑删除(0: 未删除, 1: 已删除)',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户通知公告关联表';

-- ----------------------------
-- Records of sys_user_notice
-- ----------------------------
INSERT INTO `sys_user_notice` VALUES (1, 1, 2, 1, NULL, now(), now(), 0);
INSERT INTO `sys_user_notice` VALUES (2, 2, 2, 1, NULL, now(), now(), 0);
INSERT INTO `sys_user_notice` VALUES (3, 3, 2, 1, NULL, now(), now(), 0);
INSERT INTO `sys_user_notice` VALUES (4, 4, 2, 1, NULL, now(), now(), 0);
INSERT INTO `sys_user_notice` VALUES (5, 5, 2, 1, NULL, now(), now(), 0);
INSERT INTO `sys_user_notice` VALUES (6, 6, 2, 1, NULL, now(), now(), 0);
INSERT INTO `sys_user_notice` VALUES (7, 7, 2, 1, NULL, now(), now(), 0);
INSERT INTO `sys_user_notice` VALUES (8, 8, 2, 1, NULL, now(), now(), 0);

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
    `user_id` bigint NOT NULL COMMENT '用户ID',
    `role_id` bigint NOT NULL COMMENT '角色ID',
    PRIMARY KEY (`user_id`, `role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户和角色关联表';

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT IGNORE INTO `sys_user_role` VALUES (1, 1);
INSERT IGNORE INTO `sys_user_role` VALUES (2, 2);
INSERT IGNORE INTO `sys_user_role` VALUES (3, 3);
INSERT IGNORE INTO `sys_user_role` VALUES (4, 4);
INSERT IGNORE INTO `sys_user_role` VALUES (5, 5);
INSERT IGNORE INTO `sys_user_role` VALUES (6, 6);
INSERT IGNORE INTO `sys_user_role` VALUES (7, 7);

-- ----------------------------
-- Table structure for sys_user_social
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_social`;
CREATE TABLE `sys_user_social` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` bigint NOT NULL COMMENT '用户ID',
    `platform` varchar(20) NOT NULL COMMENT '平台类型(WECHAT_MINI/WECHAT_MP/ALIPAY/QQ/APPLE)',
    `openid` varchar(64) NOT NULL COMMENT '平台openid',
    `unionid` varchar(64) COMMENT '微信unionid',
    `nickname` varchar(64) COMMENT '第三方昵称',
    `avatar` varchar(255) COMMENT '第三方头像URL',
    `session_key` varchar(128) COMMENT '微信session_key',
    `verified` tinyint(1) DEFAULT '1' COMMENT '是否已验证(1-已验证 0-未验证)',
    `create_time` datetime COMMENT '绑定时间',
    `update_time` datetime COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_platform_openid` (`platform`, `openid`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_unionid` (`unionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户第三方账号绑定表';

SET FOREIGN_KEY_CHECKS = 1;
