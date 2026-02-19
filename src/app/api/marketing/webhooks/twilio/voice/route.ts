import { NextResponse } from "next/server";

const FORWARD_TO = "+19544591697";

const GREETING =
  "You've reached The Level Team. Sit tight, we're with you shortly.";

export async function POST() {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${GREETING}</Say>
  <Dial timeout="30" callerId="${process.env.TWILIO_PHONE_NUMBER}">
    <Number>${FORWARD_TO}</Number>
  </Dial>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
