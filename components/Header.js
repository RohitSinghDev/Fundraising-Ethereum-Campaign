import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  return (
    <Menu style={{ marginTop: "20px" }}>
      {/* <Menu.Item>CrowdCoin</Menu.Item> */}
      {/* styling of link tag and menu.item has conflicting styling */}
      {/* link tag is a generic wrapper component, it wraps its children with click event handler*/}
      <Link route="/">
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
