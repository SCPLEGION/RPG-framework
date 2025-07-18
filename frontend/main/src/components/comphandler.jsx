import { ButtonDemo } from "./button";
import * as Components from "./";

export default function demopage() {
    <div>
        <h1>Demo Page</h1>
        <p>This is a demo page.</p>
        <ButtonDemo />
    </div>
}

class CompHandler extends React.Component {
    static Button = Components.ButtonDemo;
}