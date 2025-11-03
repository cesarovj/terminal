'use client'
import { JSX } from "react";

type OutputProps = {
  outputs: (string | JSX.Element)[];
};
const Output = (props: OutputProps) => {
  const outputList = props.outputs.map((o, key) => <div key={key}>{o}</div>);
  return <>{outputList}</>;
};

export default Output;
