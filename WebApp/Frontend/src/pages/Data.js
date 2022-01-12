import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";

import JTimepicker from "reactjs-timepicker";

import mediaScheduler from "../api/mediaScheduler";
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Upload,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

const Data = () => {
  // if (localStorage.getItem("user-info")) {
  //   history.push("/tables");
  // } else {
  //   history.push("/sign-in");
  // }

  const [value, setValue] = useState("12:10");
  const componentMounted = useRef(true);

  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [macAddress, setMacAddress] = useState("");

  const [uploadList, setUploadList] = useState(true);
  const [dta, setDta] = useState(null);
  // let intervalId = null;

  // const useInterval = (callback, delay) => {
  //   const savedCallback = useRef();

  //   // Remember the latest callback.
  //   useEffect(() => {
  //     savedCallback.current = callback;
  //   }, [callback]);

  //   // Set up the interval.
  //   useEffect(() => {
  //     function tick() {
  //       savedCallback.current();
  //     }
  //     if (delay !== null) {
  //       let id = setInterval(tick, delay);
  //       return () => clearInterval(id);
  //     }
  //   }, [delay]);
  // };
  const mediaSchedulerDeviceData = () => {
    if (localStorage.getItem("user-info")) {
      history.push("/data");
    } else {
      history.push("/sign-in");
    }
    // console.log("Calling");
    mediaScheduler
      .get("/api/fields")
      .then((res) => {
        if (componentMounted.current) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    // console.log("In USE");

    mediaSchedulerDeviceData();
    return () => {
      componentMounted.current = false;
    };
  }, [macAddress]);
  // console.log(checkedList);
  // useEffect(() => {}, [data]);
  // useInterval(() => {
  //   // Make the request here
  //   mediaSchedulerDeviceData();
  // }, 1000 * 60);

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      align: "center",
    },

    {
      title: "Seconds",
      key: "sec",
      dataIndex: "sec",
      align: "center",
    },
    {
      title: "Media Name",
      key: "fileName",
      align: "center",
      dataIndex: "fileName",
    },
    {
      title: "Delete",
      key: "delete",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this Client?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button data={record._id} onClick={getId} type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const getId = (e) => {
    if (e.target.parentNode.getAttribute("data")) {
      console.log(e.target.parentNode.getAttribute("data"));
      setId(e.target.parentNode.getAttribute("data"));
    } else {
      console.log(e.target.parentNode.childNodes[0].getAttribute("data"));
      setId(e.target.parentNode.childNodes[0].getAttribute("data"));
    }
  };
  const beforeUpload = (file) => {
    console.log(file);
    setDta(file);

    return false;
  };

  const confirm = (e) => {
    const hide = message.loading("Processing", 0);

    mediaScheduler
      .delete(`/api/fields/delete/${id}`)
      .then((res) => {
        console.log(res);
        setTimeout(hide, 0);

        // adminData();
        message.success("Schedule Deleted");
        mediaSchedulerDeviceData();
      })
      .catch((err) => {
        console.log(err);
        message.error("Something Went Wrong!");
        setTimeout(hide, 0);
      });
  };
  const cancel = () => {
    console.log(cancel);
  };
  //Modal Functions
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Form Functions
  const onFinish = async (values) => {
    console.log(dta);
    console.log(value);

    let formData = new FormData();

    formData.append("time", value);
    formData.append("sec", values.sec);
    formData.append("photo", dta);

    const hide = message.loading("Processing", 0);
    // console.log(id);
    await mediaScheduler
      .post("/api/fields/saveField/", formData, {
        headers: {
          "content-type": "multipart/formdata",
        },
      })
      .then((res) => {
        console.log(res);
        // Dismiss manually and asynchronously
        setTimeout(hide, 0);
        mediaSchedulerDeviceData();
        setIsModalVisible(false);
        message.success("Schedule Added");
      })
      .catch((err) => {
        console.log(err);

        setTimeout(hide, 0);

        message.error("Something went wrong!");

        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className="flex-container" style={{ marginBottom: "10px" }}>
        <Button
          type="primary"
          className="addDevicebtn"
          onClick={showModal}
          style={{
            marginLeft: "5px",
            borderRadius: "50px",
          }}
        >
          Add Media
        </Button>
        <Modal
          title="Add a New Device"
          visible={isModalVisible}
          // onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose={true}
          footer={null}
        >
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            className="row-col"
          >
            <Form.Item
              className="username"
              label="Time"
              name="time"
              rules={[
                {
                  required: true,
                  message: "Please Enter Time",
                },
              ]}
            >
              <JTimepicker
                onChange={(time) => setValue(time)}
                color="#1890ff"
                style={{
                  color: "white",
                }}
              />
              {/* <TimePicker
                  onChange={onChange}
                  value="22:15:00"
                  disableClock={true}
                  format={"h:m:s a"}
                /> */}
            </Form.Item>
            <Form.Item
              className="username"
              label="Seconds"
              name="sec"
              rules={[
                {
                  required: true,
                  message: "Please Enter Seconds",
                },
              ]}
            >
              <Input
                placeholder="Enter Seconds"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item className="username" label="Media" name="photo">
              <Upload beforeUpload={beforeUpload} showUploadList={uploadList}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              ,
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Media Scheduler"
            >
              <div className="table-responsive">
                <Table
                  key="enCol"
                  columns={columns}
                  pagination={false}
                  dataSource={data}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Data;
