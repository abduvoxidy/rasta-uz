export const historyOrdersStatusId =
  "d39cb255-6cf5-4602-896d-9c559d40cbbe,e665273d-5415-4243-a329-aee410e39465,79413606-a56f-45ed-97c3-f3f18e645972,6ba783a3-1c2e-479c-9626-25526b3d9d36,c4227d1b-c317-46f8-b1e3-a48c2496206f,b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1";
export const currentOrdersStatusId =
  "986a0d09-7b4d-4ca9-8567-aa1c6d770505,bf9cc968-367d-4391-93fa-f77eda2a7a99,ccb62ffb-f0e1-472e-bf32-d130bea90617,1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,8781af8e-f74d-4fb6-ae23-fd997f4a2ee0,84be5a2f-3a92-4469-8283-220ca34a0de4";

export const statuses = {
  NewStatusId: "986a0d09-7b4d-4ca9-8567-aa1c6d770505",
  FutureStatusId: "bf9cc968-367d-4391-93fa-f77eda2a7a99",
  OperatorAcceptedStatusId: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
  VendorAcceptedStatusId: "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3",
  VendorReadyStatusId: "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd",
  CourierAcceptedStatusId: "8781af8e-f74d-4fb6-ae23-fd997f4a2ee0",
  CourierPickedUpStatusId: "84be5a2f-3a92-4469-8283-220ca34a0de4",
  DeliveredStatusId: "79413606-a56f-45ed-97c3-f3f18e645972",
  FinishedStatusId: "e665273d-5415-4243-a329-aee410e39465",
  OperatorCancelledStatusId: "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
  VendorCancelledStatusId: "c4227d1b-c317-46f8-b1e3-a48c2496206f",
  CourierCancelledStatusId: "6ba783a3-1c2e-479c-9626-25526b3d9d36",
  ServerCancelledStatusId: "d39cb255-6cf5-4602-896d-9c559d40cbbe",
};

export const getStatusIndex = (statusId) => {
  switch (statusId) {
    case OperatorAcceptedStatusId: {
      return 1;
    }
    case NewStatusId: {
      return 1;
    }
    case FutureStatusId: {
      return 1;
    }
    case VendorReadyStatusId: {
      return 2;
    }
    case VendorAcceptedStatusId: {
      return 2;
    }
    case CourierAcceptedStatusId: {
      return 2;
    }
    case CourierPickedUpStatusId: {
      return 3;
    }

    case DeliveredStatusId: {
      return 4;
    }
    case FinishedStatusId: {
      return 4;
    }
    default: {
      return 1;
    }
  }
};

export const orderStepTitle = (statusIndex) => {
  switch (statusIndex) {
    case 1:
      return "received";
    case 2:
      return "getting_ready";
    case 3:
      return "courier_way";
    case 4:
      return "delivered";
    default:
      return "";
  }
};

const {
  NewStatusId,
  OperatorAcceptedStatusId,
  VendorReadyStatusId,
  VendorAcceptedStatusId,
  CourierAcceptedStatusId,
  CourierPickedUpStatusId,
  DeliveredStatusId,
  FinishedStatusId,
  OperatorCancelledStatusId,
  VendorCancelledStatusId,
  CourierCancelledStatusId,
  ServerCancelledStatusId,
  FutureStatusId,
} = statuses;

export const statusCheck = (id, t = () => {}) => {
  switch (id) {
    case NewStatusId:
      return (
        <StatusTag color="#0452C8" bgColor="#D7EDFF">
          {t("new")}
        </StatusTag>
      );
    case FutureStatusId:
      return (
        <StatusTag color="#0452C8" bgColor="#D7EDFF">
          {t("pre_order")}
        </StatusTag>
      );
    case OperatorAcceptedStatusId:
      return (
        <StatusTag color="#006d75" bgColor="#b5f5ec">
          {t("operator_accepted")}
        </StatusTag>
      );
    case VendorReadyStatusId:
      return (
        <StatusTag color="#d48806" bgColor="#fff1b8">
          {t("branch_prepared")}
        </StatusTag>
      );
    case VendorAcceptedStatusId:
      return (
        <StatusTag color="#ad8b00" bgColor="#fffb8f">
          {t("branch_accpeted")}
        </StatusTag>
      );
    case CourierAcceptedStatusId:
      return (
        <StatusTag color="#0452C8" bgColor="#D7EDFF">
          {t("courier_accepted")}
        </StatusTag>
      );
    case CourierPickedUpStatusId:
      return (
        <StatusTag color="#003a8c" bgColor="#bae7ff">
          {t("courier_way")}
        </StatusTag>
      );
    case DeliveredStatusId:
      return (
        <StatusTag color="#237804" bgColor="#b7eb8f">
          {t("delivered")}
        </StatusTag>
      );
    case FinishedStatusId:
      return (
        <StatusTag color="#1AC19D" bgColor="rgba(56, 217, 185, 0.15)">
          {t("completed")}
        </StatusTag>
      );
    case OperatorCancelledStatusId:
      return (
        <StatusTag color="#F76659" bgColor="rgba(247, 102, 89, 0.1)">
          {t("operator_canceled")}
        </StatusTag>
      );
    case VendorCancelledStatusId:
      return (
        <StatusTag color="#F76659" bgColor="rgba(247, 102, 89, 0.1)">
          {t("branch_canceled")}
        </StatusTag>
      );
    case CourierCancelledStatusId:
      return (
        <StatusTag color="#F76659" bgColor="rgba(247, 102, 89, 0.1)">
          {t("courier_canceled")}
        </StatusTag>
      );
    case ServerCancelledStatusId:
      return (
        <StatusTag color="#F76659" bgColor="rgba(247, 102, 89, 0.1)">
          {t("server_canceled")}
        </StatusTag>
      );
    default:
      return <></>;
  }
};

const StatusTag = ({ color, bgColor, children }) => (
  <div
    style={{
      color,
      //   backgroundColor: bgColor,
      //   padding: '2px 15px',
      whiteSpace: "nowrap",
      borderRadius: "6px",
    }}
  >
    {children}
  </div>
);

const restaurantId = "00854125-cf0a-4062-8a4d-f2bb1892487b";
const rastaAndRestaurantId = "8b0a7fa2-c758-4330-93f6-95377368886f";
const rastaId = "450a2284-97ac-407b-9a6d-58b79d711467";

export const checkDeliveryRestaurant = (id) => {
  switch (id) {
    case restaurantId:
      return "restaurant_delivers";
    case rastaAndRestaurantId:
    case rastaId:
      return "rasta_delivers";
    default:
      return "";
  }
};
