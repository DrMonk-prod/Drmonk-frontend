import { Doctor } from "@/types/doctor-types";
import axios from "axios";
import { toast } from "sonner";

const basUrl = process.env.NEXT_PUBLIC_NODE_URL || "http://localhost:5000/api";

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function displayRazorpay(amount: number, appointmentId: number, doctotorName: string) {

  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

  if (!res) {
    alert('Razropay failed to load!!')
    return
  }

  const data = {
    amount, appointmentId
  }

  const response = await axios.post(`${basUrl}/payment/create-order`, data);

  const order = response.data;

  const options = {
    "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    "amount": amount,
    "currency": "INR",
    "name": "FindDr",
    "description": "Findr Payment",
    "image": "https://example.com/your_logo",
    "order_id": order.id,
    "callback_url": "http://localhost:3000",
    "notes": {
      "address": "FindDr Corporate Office",
    },
    "theme": {
      "color": "#3399cc"
    },
    "prefill": {
      "name": doctotorName
    },
    handler: async function (response: any) {
      //Send details to backend for verification
      try {
        const verifyRes = await axios.post(`${basUrl}/payment/verify-payment`, {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          appointmentId
        });
        console.log("Verification success:", verifyRes.data);
      } catch (error) {
        console.error("Verification failed:", error);
      }
    }
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.on("payment.failed", function (response: any) {
    toast.error("Payment failed. Please try again.");
    console.error("Payment failed:", response.error);
  });
  paymentObject.open();
}
