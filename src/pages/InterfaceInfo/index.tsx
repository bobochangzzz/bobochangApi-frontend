import { removeRule } from "@/services/ant-design-pro/api";
import { PlusOutlined } from "@ant-design/icons";
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from "@ant-design/pro-components";
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import "@umijs/max";
import { Button, Drawer, message } from "antd";
import React, { useRef, useState } from "react";
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  updateInterfaceInfoUsingPOST,
} from "@/services/bobochangAPi-backend/interfaceInfoController";
import { SortOrder } from "antd/lib/table/interface";
import CreateModal from "@/pages/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/InterfaceInfo/components/UpdateModal";

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading("正在添加");
    try {
      await addInterfaceInfoUsingPOST({
        ...fields,
      });
      hide();
      message.success("创建成功");
      handleModalVisible(false);
      return true;
    } catch (error: any) {
      hide();
      message.error("创建失败 " + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    const hide = message.loading("正在提交");
    try {
      await updateInterfaceInfoUsingPOST({
        ...fields,
      });
      hide();
      message.success("操作成功");
      return true;
    } catch (error: any) {
      hide();
      message.error("操作失败 " + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading("正在删除");
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      message.success("删除成功");
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error("删除失败 " + error.message);
      return false;
    }
  };
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "index",
    },
    {
      title: "接口名称",
      dataIndex: "name",
      valueType: "text",
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "描述",
      dataIndex: "description",
      valueType: "textarea",
    },
    {
      title: "请求方法",
      dataIndex: "method",
      valueType: "text",
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "url",
      dataIndex: "url",
      valueType: "text",
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "请求头",
      dataIndex: "requestHeader",
      valueType: "textarea",
    },
    {
      title: "响应头",
      dataIndex: "responseHeader",
      valueType: "textarea",
    },
    {
      title: "状态",
      dataIndex: "status",
      hideInForm: true,
      valueEnum: {
        0: {
          text: "关闭",
          status: "Default",
        },
        1: {
          text: "开启",
          status: "Processing",
        },
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInForm: true,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="config"
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, React.ReactText[] | null>
        ) => {
          const res: any = await listInterfaceInfoByPageUsingGET({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{" "}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{" "}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计{" "}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{" "}
                万
              </span>
            </div>
          }
        >
        </FooterToolbar>
      )}
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalVisible(false);
        }}
        onSubmit={(values) => {
          handleAdd(values);
        }}
        visible={createModalVisible}
      />
    </PageContainer>
  );
};
export default TableList;
