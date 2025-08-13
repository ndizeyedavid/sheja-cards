"use client";
import "./main.css";
export default function page() {
    return (
        <section className="card-container">
            <div className="std-card">
                <div className="header">
                    <img src="./header.png" alt="" />
                </div>

                <div className="card-details">
                    <div className="img-container">
                        <div
                            className="img"
                            style={{
                                backgroundImage: `url('${"sad"}')`,
                                backgroundSize: "120% 120%",
                            }}
                        ></div>
                    </div>
                    <div className="img-ribbon">
                        <div className="side"></div>
                        <img src="./title.png" alt="" />
                    </div>

                    <div className="info">
                        <table>
                            <tr style={{ height: "50px" }}>
                                <td style={{ width: "30px" }}>NAME</td>
                                <td>:</td>
                                <td style={{ width: "100%; padding-left: 10px" }}>
                                    {/* ${card.name} */}
                                </td>
                            </tr>

                            <tr style={{ height: "50px" }}>
                                <td>CLASS</td>
                                <td>:</td>
                                <td style={{ width: "100%; padding-left: 10px" }}>
                                    {/* ${card.class} */}
                                </td>
                            </tr>

                            <tr style={{ height: "50px" }}>
                                <td>STATUS</td>
                                <td>:</td>
                                <td style={{ width: "100%; padding-left: 10px" }}>
                                    {/* ${card.gender} */}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                {/* 
                <div className="qr">
                    <img src="./qr.webp" id="std-${i}" alt="qr-code" />
                    <img src="./logo.png" className="logo" alt="logo" />
                </div>

                <div className="footer">
                    <img src="./footer.png" alt="" />
                    <p className="year">2024 / 2025</p>
                </div> */}
            </div>
        </section>
    );
}
