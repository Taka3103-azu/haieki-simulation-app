"use client";

import { useState, useEffect } from "react";



const formulaStyle = {
  fontSize: "14px",
  color: "#555",
  marginTop: "8px",
  lineHeight: "1.4",
};



// 入力項目カードのスタイル
const formBlockStyle = {
  backgroundColor: "#F1F8E9",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #c8e6c9",
  marginBottom: "30px",
};

// カード共通スタイル
const cardBase = {
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #b7d8b7",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  width: "100%",
};

// 結果カード
const sellCardStyle = {
  ...cardBase,
  backgroundColor: "#E8F5E9",
};

const reductionCardStyle = {
  ...cardBase,
  backgroundColor: "#C8E6C9",
};

const costCardStyle = {
  ...cardBase,
  backgroundColor: "#FFEBEE",
};

const finalProfitCardStyle = {
  ...cardBase,
  backgroundColor: "#FFF9C4",
};

// ラベルと入力欄のスタイル（視認性改善）
const labelStyle = {
  display: "block",
  fontWeight: "700",
  fontSize: "18px",
  marginBottom: "6px",
  color: "#1B5E20",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "6px",
  border: "1px solid #81C784",
  fontSize: "18px",
  marginBottom: "16px",
};

export default function SimulationPage() {
  const [category, setCategory] = useState("");
  const [component, setComponent] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [bod, setBod] = useState("");
  const [lot, setLot] = useState("");

  const [disposal, setDisposal] = useState("");
  const [transport, setTransport] = useState("");
  const [analysis, setAnalysis] = useState("");

  // 買いたい側
const [requiredCarbon, setRequiredCarbon] = useState("");
const [carbonPrice, setCarbonPrice] = useState("");

const [buyBod, setBuyBod] = useState("");
const [buyLot, setBuyLot] = useState("");

const [buyTransport, setBuyTransport] = useState("");
const [buyAnalysis, setBuyAnalysis] = useState("");

const [wastePurchasePrice, setWastePurchasePrice] = useState("");

// 買いたい側 計算結果

const [availableCarbon, setAvailableCarbon] = useState(0);

const [replaceableCarbon, setReplaceableCarbon] = useState(0);

const [carbonSaving, setCarbonSaving] = useState(0);

const [buyTransportCost, setBuyTransportCost] = useState(0);

const [wastePurchaseCost, setWastePurchaseCost] = useState(0);

const [buyProfit, setBuyProfit] = useState(0);

const [error, setError] = useState("");

const [inorganicDensity, setInorganicDensity] = useState("");
const [inorganicConcentration, setInorganicConcentration] = useState("");

const [activeTab, setActiveTab] = useState("sell"); 
// "sell" = 売りたい側, "buy" = 買いたい側

const [buyCalculated, setBuyCalculated] = useState(false);
const [sellCalculated, setSellCalculated] = useState(false);




const organicPrices: Record<string, number> = {
  "グルコース": 150,
  "酢酸": 80,
  "メタノール": 90,
  "エタノール": 90,   // ★ 追加（単価は自由に変更OK）
};

 

  const inorganicPrices: Record<string, number> = {
    "CaCl₂": 50,
    "MgCl₂": 70,
    "NaCl": 20,
  };

  const componentList =
    category === "organic"
      ? Object.keys(organicPrices)
      : category === "inorganic"
      ? Object.keys(inorganicPrices)
      : [];

  // ★ カテゴリー選択時に主成分と単価を自動セット
  useEffect(() => {
    if (category === "organic") {
      const first = Object.keys(organicPrices)[0];
      setComponent(first);
      setUnitPrice(String(organicPrices[first]));
    } else if (category === "inorganic") {
      const first = Object.keys(inorganicPrices)[0];
      setComponent(first);
      setUnitPrice(String(inorganicPrices[first]));
    }
  }, [category]);

  const handleComponentChange = (value: string) => {
    setComponent(value);

    if (category === "organic") {
      setUnitPrice(String(organicPrices[value]));
    } else if (category === "inorganic") {
      setUnitPrice(String(inorganicPrices[value]));
    }
  };

  const [sellValue, setSellValue] = useState(0);
  const [reduction, setReduction] = useState(0);
  const [transportAnalysisTotal, setTransportAnalysisTotal] = useState(0);
  const [finalProfit, setFinalProfit] = useState(0);

 const calculate = () => {
  // Step1 未入力チェック
  if (!lot) {
    setError("ロット量を入力してください");
return;
    
  }

  if (!disposal) {
    alert("廃棄物処理費を入力してください");
    return;
  }

  // Step2 0以下チェック
  if (Number(lot) <= 0) {
    alert("ロット量は0より大きい値を入力してください");
    return;
  }

  if (Number(disposal) <= 0) {
    alert("廃棄物処理費は0より大きい値を入力してください");
    return;
  }

let sale = 0;


// 単価を直接取得
const currentPrice =
category === "organic"
? organicPrices[component]
: inorganicPrices[component];

if (category === "organic" && !bod) {
  alert("BOD濃度を入力してください");
  return;
}

if (
  category === "inorganic" &&
  (!inorganicConcentration || !inorganicDensity)
) {
  alert("濃度と比重を入力してください");
  return;
}
if (category === "organic") {
  sale =
    (Number(bod) / 1000) *
    Number(lot) *
    currentPrice;
}

if (category === "inorganic") {
  sale =
    (Number(inorganicConcentration) / 1000) *
    Number(inorganicDensity) *
    Number(lot) *
    currentPrice;
}
setSellValue(sale);

// 廃棄コスト削減額
const reductionValue =
Number(disposal) *
Number(lot) *
1000;

setReduction(reductionValue);

// 運搬費
const transportCost =
Number(transport) *
Number(lot);

// 運搬＋分析
const transportAnalysis =
transportCost +
Number(analysis);

setTransportAnalysisTotal(
transportAnalysis
);

// 最終利益
const profit =
sale +
reductionValue -
transportAnalysis;

setFinalProfit(profit);

setSellCalculated(true);

setError("");

};


const calculateBuy = () => {

  if (!requiredCarbon) {
        setError("必要炭素量を入力してください");
    return;
  }

  if (!carbonPrice) {
  setError("炭素源単価を入力してください");
  return;
}

if (!buyBod) {
  setError("BOD濃度を入力してください");
  return;
}

if (!buyLot) {
  setError("ロット量を入力してください");
  return;
}

if (!buyTransport) {
  setError("運搬費を入力してください");
  return;
}

if (!wastePurchasePrice) {
  setError("廃液購入費を入力してください");
  return;
}

if (Number(requiredCarbon) <= 0) {
  setError("必要炭素量は0より大きい値を入力してください");
  return;
}

if (Number(carbonPrice) <= 0) {
  setError("炭素源単価は0より大きい値を入力してください");
  return;
}

if (Number(buyBod) <= 0) {
  setError("BOD濃度は0より大きい値を入力してください");
  return;
}

if (Number(buyLot) <= 0) {
  setError("ロット量は0より大きい値を入力してください");
  return;
}

if (Number(buyTransport) <= 0) {
  setError("運搬費は0より大きい値を入力してください");
  return;
}

if (Number(wastePurchasePrice) < 0) {
  setError("廃液購入費は0以上を入力してください");
  return;
}

  // ① 廃液から得られる炭素量
  const available =
    (Number(buyBod) / 1000) *
    Number(buyLot);

  setAvailableCarbon(available);
const replaceable = Math.min(
  Number(requiredCarbon),
  available
);

setReplaceableCarbon(replaceable);
// ③ 炭素源購入費削減額
const saving =
  replaceable *
  Number(carbonPrice);

setCarbonSaving(saving);
// ④ 運搬費
const transportCost =
  Number(buyTransport) *
  Number(buyLot);

setBuyTransportCost(transportCost);
// ⑤ 廃液購入費
const purchaseCost =
  Number(wastePurchasePrice) *
  Number(buyLot);

setWastePurchaseCost(purchaseCost);
// ⑥ 純利益
const profit =
  saving -
  (
    transportCost +
    Number(buyAnalysis) +
    purchaseCost
  );

setBuyProfit(profit);

setBuyCalculated(true);

setError("");
};

  return (
          
    
    <div style={{ padding: 40, fontSize: "18px", color: "#1B1B1B" }}>
      {/* タイトル */}
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
  <button
    onClick={() => setActiveTab("sell")}
    style={{
      padding: "10px 20px",
      backgroundColor: activeTab === "sell" ? "#4CAF50" : "#ddd",
      color: activeTab === "sell" ? "white" : "black",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    売りたい側
  </button>

  <button
    onClick={() => setActiveTab("buy")}
    style={{
      padding: "10px 20px",
      backgroundColor: activeTab === "buy" ? "#4CAF50" : "#ddd",
      color: activeTab === "buy" ? "white" : "black",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    買いたい側
  </button>
</div>

      <div
        style={{
          backgroundColor: "#E8F5E9",
          padding: "18px 24px",
          borderRadius: "10px",
          border: "1px solid #C8E6C9",
          marginBottom: "30px",
          width: "fit-content",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#2E7D32",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          廃液売買シミュレーション
        </h1>
      </div>

      {/* カテゴリー入力カード */}
      {activeTab === "sell" && (
      <div style={formBlockStyle}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#1B5E20",
            marginBottom: "16px",
          }}
        >
          入力項目
        </h2>

        <label style={labelStyle}>カテゴリー</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="">選択してください</option>
          <option value="organic">有機</option>
          <option value="inorganic">無機</option>
        </select>

        <label style={labelStyle}>主成分</label>
        <select
          value={component}
          onChange={(e) => handleComponentChange(e.target.value)}
          style={inputStyle}
        >
          {componentList.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label style={labelStyle}>単価（円/kg）</label>
        <input
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          style={inputStyle}
        />
      </div>

     )}



     
      {/* ★ 売りたい側カード（2列レイアウト） */}
{/* ★ 売りたい側カード（2列レイアウト・カードは1つだけ） */}
{activeTab === "sell" && (
<div
  style={{
    border: "2px solid #ccc",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    marginBottom: "30px",
  }}
>
  <h2
    style={{
      fontSize: "22px",
      fontWeight: "700",
      color: "#1B5E20",
      marginBottom: "16px",
    }}
  >
    売りたい側：入力項目
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px 30px",
    }}
  >
    {/* 左列 */}
    <div>
      {/* 有機だけ表示 */}
      {category === "organic" && (
        <>
          <label style={labelStyle}>BOD濃度（mg/L）</label>
          <input
            type="number"
            value={bod}
           onChange={(e) => {
  setBod(e.target.value);
  setError("");
}}
            style={inputStyle}
          />
        </>
      )}

      {/* 無機だけ表示 */}
      {category === "inorganic" && (
        <>
          <label style={labelStyle}>無機の濃度（mg/L）</label>
          <input
            type="number"
            value={inorganicConcentration}
            onChange={(e) => {
  setInorganicConcentration(e.target.value);
  setError("");
}}
            style={inputStyle}
          />

          <label style={labelStyle}>無機の比重</label>
          <input
            type="number"
            value={inorganicDensity}
            onChange={(e) => {
  setInorganicDensity(e.target.value);
  setError("");
}}
            style={inputStyle}
          />
        </>
      )}

      {/* 共通：ロット量 */}
      <label style={labelStyle}>ロット量（m³）</label>
      <input
        type="number"
        value={lot}
        onChange={(e) => {
  setLot(e.target.value);
  setError("");
}}
        style={inputStyle}
      />
    </div>

    {/* 右列（共通） */}
    <div>
      <label style={labelStyle}>廃棄物処理費（円/kg）</label>
      <input
        type="number"
        value={disposal}
        onChange={(e) => {
  setDisposal(e.target.value);
  setError("");
}}
        style={inputStyle}
      />

      <label style={labelStyle}>運搬費（円/㎥）</label>
      <input
        type="number"
        value={transport}
        onChange={(e) => {
  setTransport(e.target.value);
  setError("");
}}
        style={inputStyle}
      />

      <label style={labelStyle}>分析費（円）</label>
      <input
        type="number"
        value={analysis}
        onChange={(e) => {
  setAnalysis(e.target.value);
  setError("");
}}
        style={inputStyle}
      />
    </div>
  </div>
</div>
)}



{activeTab === "buy" && (
  <div
    style={{
      border: "2px solid #ccc",
      padding: "20px",
      borderRadius: "10px",
      backgroundColor: "#fff",
      marginBottom: "30px",
    }}
  >
    <h2
      style={{
        fontSize: "22px",
        fontWeight: "700",
        color: "#1B5E20",
        marginBottom: "16px",
      }}
    >
      買いたい側：入力項目
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px 30px",
      }}
    >
      {/* 左列 */}
      <div>
        <label style={labelStyle}>必要炭素量（kg/月）</label>
        <input
          type="number"
          value={requiredCarbon}
          onChange={(e) => {
  setRequiredCarbon(e.target.value);
  setError("");
}}
          style={inputStyle}
        />

        <label style={labelStyle}>炭素源単価（円/kg）</label>
        <input
          type="number"
          value={carbonPrice}
          onChange={(e) => {
  setCarbonPrice(e.target.value);
  setError("");
}}
          style={inputStyle}
        />

        <label style={labelStyle}>BOD濃度（mg/L）</label>
        <input
          type="number"
          value={buyBod}
          onChange={(e) => {
  setBuyBod(e.target.value);
  setError("");
}}
          style={inputStyle}
        />

        <label style={labelStyle}>ロット量（m³）</label>
        <input
          type="number"
          value={buyLot}
          onChange={(e) => {
  setBuyLot(e.target.value);
  setError("");
}}
          style={inputStyle}
        />
      </div>

      {/* 右列 */}
      <div>
        <label style={labelStyle}>運搬費（円/m³）</label>
        <input
          type="number"
          value={buyTransport}
         onChange={(e) => {
  setBuyTransport(e.target.value);
  setError("");
}}
          style={inputStyle}
        />

        <label style={labelStyle}>分析費（円）</label>
        <input
          type="number"
          value={buyAnalysis}
          onChange={(e) => {
  setBuyAnalysis(e.target.value);
  setError("");
}}
          style={inputStyle}
        />

        <label style={labelStyle}>廃液購入費（円/m³）</label>
        <input
          type="number"
          value={wastePurchasePrice}
          onChange={(e) => {
  setWastePurchasePrice(e.target.value);
  setError("");
}}
          style={inputStyle}
        />
      </div>
    </div>
  </div>
)}

{activeTab === "buy" && (
<>

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    marginBottom: "30px",
  }}
>
  <button
    onClick={calculateBuy}
    style={{
      padding: "14px 32px",
      fontSize: "20px",
      borderRadius: "8px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    計算する
  </button>
</div>
{error && (
  <div
    style={{
      color: "#D32F2F",
      backgroundColor: "#FFEBEE",
      border: "1px solid #EF9A9A",
      borderRadius: "6px",
      padding: "8px 12px",
      marginBottom: "15px",
      fontWeight: "600",
    }}
  >
    ⚠ {error}
  </div>
)}

<div
  style={{
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  }}
>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "30px",
  }}
>
  <div style={sellCardStyle}>
    <h3>廃液由来炭素量</h3>
    <p style={{ fontSize: "28px", fontWeight: "700", color: "#1B5E20" }}>
      {availableCarbon.toLocaleString()} kg
    </p>
    <div style={formulaStyle}>
  式：
  BOD濃度（{buyBod} mg/L）
  ÷ 1000
  × ロット量（{buyLot} m³）
</div>

</div>

<div style={sellCardStyle}>
  <h3>代替可能炭素量</h3>

  <p style={{ fontSize: "28px", fontWeight: "700", color: "#1B5E20" }}>
    {replaceableCarbon.toLocaleString()} kg
  </p>

  <div style={formulaStyle}>
    式：
    MIN(
    必要炭素量（{requiredCarbon} kg/月）,
    廃液由来炭素量（{availableCarbon.toLocaleString()} kg）
    )
  </div>
</div>


  <div style={reductionCardStyle}>
    <h3>炭素源購入費削減額</h3>
    <p style={{ fontSize: "28px", fontWeight: "700", color: "#1B5E20" }}>
      {carbonSaving.toLocaleString()} 円
    </p>
    <div style={formulaStyle}>
  式：
  代替可能炭素量（{replaceableCarbon.toLocaleString()} kg）
  ×
  炭素源単価（{carbonPrice} 円/kg）
</div>
  </div>

  <div style={costCardStyle}>
  <h3>運搬費</h3>

  <p style={{ fontSize: "28px", fontWeight: "700", color: "#B71C1C" }}>
    {buyTransportCost.toLocaleString()} 円
  </p>

  <div style={formulaStyle}>
    式：
    運搬費単価（{buyTransport} 円/m³）
    ×
    ロット量（{buyLot} m³）
  </div>

</div>
 <div style={costCardStyle}>
  <h3>分析費</h3>

  <p style={{ fontSize: "28px", fontWeight: "700", color: "#B71C1C" }}>
    {Number(buyAnalysis).toLocaleString()} 円
  </p>

  <div style={formulaStyle}>
    式：
    入力した分析費
    （{Number(buyAnalysis).toLocaleString()} 円）
  </div>
</div>

  
    <div style={costCardStyle}>
  
<h3>廃液購入費</h3>
  <p style={{ fontSize: "28px", fontWeight: "700", color: "#B71C1C" }}>
    {wastePurchaseCost.toLocaleString()} 円
  </p>
<div style={formulaStyle}>
  式：
  廃液購入単価（{wastePurchasePrice} 円/m³）
  ×
  ロット量（{buyLot} m³）
</div>
  
</div>
  

  <div
  style={{
    ...finalProfitCardStyle,
    gridColumn: "1 / 3",
  }}
>
    <h3>純利益</h3>
    <p style={{ fontSize: "32px", fontWeight: "800", color: "#F57F17" }}>
      {buyProfit.toLocaleString()} 円
    </p>
    <div style={formulaStyle}>
  式：
  炭素源購入費削減額（{carbonSaving.toLocaleString()} 円）
  −
  運搬費（{buyTransportCost.toLocaleString()} 円）
  −
  分析費（{Number(buyAnalysis).toLocaleString()} 円）
  −
  廃液購入費（{wastePurchaseCost.toLocaleString()} 円）
</div>

</div>   {/* finalProfitCardStyle終了 */}
</div>   {/* grid終了 */}
</div>   {/* 外枠終了 */}

</>
)}
  

{activeTab === "sell" && (
<>
{/* ★ 計算ボタン（grid の外） */}
<div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", marginBottom: "30px" }}>
  <button
    onClick={calculate}
    style={{
      padding: "14px 32px",        // ← 高さと横幅をしっかり確保
      fontSize: "20px",            // ← 視認性UP
      borderRadius: "8px",         // ← カードと調和
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",           // ← 少し太字で存在感UP
    }}
  >
    計算する
  </button>
  </div>
{error && (
  <div
    style={{
      color: "#D32F2F",
      backgroundColor: "#FFEBEE",
      border: "1px solid #EF9A9A",
      borderRadius: "6px",
      padding: "8px 12px",
      marginBottom: "15px",
      fontWeight: "600",
    }}
  >
    ⚠ {error}
  </div>
)}

{sellCalculated && (
<>
     {/* ★ 計算結果（数字を大きく） */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "30px",
  }}
>
  {/* 売却価値 */}
  <div style={sellCardStyle}>
    <h3>売却価値</h3>
    <p style={{ fontSize: "28px", fontWeight: "700", color: "#1B5E20" }}>
      {sellValue.toLocaleString()} 円
    </p>

    {category === "organic" && (
      <div style={formulaStyle}>
        式：BOD濃度（{bod} mg/L） ÷ 1000 × ロット量（{lot} m³） × 単価（{unitPrice} 円/kg）
      </div>
    )}

    {category === "inorganic" && (
      <div style={formulaStyle}>
  式：濃度（{inorganicConcentration} mg/L）
  ÷ 1000 × 比重（{inorganicDensity}）
  × ロット量（{lot} m³）
  × 単価（{unitPrice} 円/kg）
</div>
    )}
  </div>

  {/* 削減額 */}
  <div style={reductionCardStyle}>
    <h3>削減額</h3>
    <p style={{ fontSize: "28px", fontWeight: "700", color: "#1B5E20" }}>
      {reduction.toLocaleString()} 円
    </p>

    <div style={formulaStyle}>
      式：廃棄物処理費（{disposal} 円/kg） × ロット量（{lot} m³） × 1000 kg
    </div>
  </div>

  {/* 運搬＋分析費 */}
  <div style={costCardStyle}>
    <h3>運搬＋分析費</h3>
    <p style={{ fontSize: "28px", fontWeight: "700", color: "#B71C1C" }}>
      {transportAnalysisTotal.toLocaleString()} 円
    </p>

    <div style={formulaStyle}>
      式：運搬費（{transport} 円/㎥） + 分析費（{analysis} 円）
    </div>
  </div>

  {/* 最終利益 */}
  <div style={finalProfitCardStyle}>
    <h3>純利益</h3>
    <p style={{ fontSize: "32px", fontWeight: "800", color: "#F57F17" }}>
      {finalProfit.toLocaleString()} 円
    </p>

    <div style={formulaStyle}>
      式：売却価値（{sellValue.toLocaleString()} 円）
      ＋ 削減額（{reduction.toLocaleString()} 円）
      −（運搬費 + 分析費）（{transportAnalysisTotal.toLocaleString()} 円）
    </div>
  </div>
</div>  {/* ← ★ この閉じタグが抜けていた！ */}
</>
)}
  </>
)}
</div>   
  );
}
