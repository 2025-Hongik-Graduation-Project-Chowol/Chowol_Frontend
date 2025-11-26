import React from "react";
import xLogo from "../../assets/upload/X-Logo.svg";
import instagram from "../../assets/upload/Logo-Instagram.svg";
import youtube from "../../assets/upload/Logo-YouTube.svg";
import linkedin from "../../assets/upload/LinkedIn.svg";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-left">
        <img src={xLogo} />
        <img src={instagram} />
        <img src={youtube} />
        <img src={linkedin} />
      </div>

      <div className="footer-right">
        <div className="crew-block">
          <p>crew : 이채유</p>
          <p>contact : 0102XXX5110</p>
          <p>role: full stack, 디자인, 기획, 일정관리</p>
          <p>footnote : “다들 힘내” 를 거꾸로 읽어보세요</p>
        </div>

        <div className="crew-block">
          <p>crew : 이수민</p>
          <p>contact : 0106XXX0968</p>
          <p>role: full stack, 디자인, 기획, 일정관리</p>
          <p>footnote : "내힘 들다" </p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
