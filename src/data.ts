import { ReportData, ThemeStyles } from './types';

export const INITIAL_REPORT_DATA: ReportData = {
  cover: {
    title: "數位時代 AI 人工智慧的應用、衝擊與未來展望",
    subtitle: "以繁盛的大型語言模型（LLM）與生成式 AI 為核心探討",
    courseName: "資訊軟體應用",
    department: "五航四甲",
    studentName: "林小明",
    studentId: "B11009024",
    professor: "張教授 指導",
    date: "2026 年 6 月 7 日"
  },
  reflections: {
    paragraphs: [
      "科技的发展总是以惊人的速度颠覆我们的日常生活，而近年生成式 AI 的崛起尤其如此。在學習這門課程並深入探究 ChatGPT 及多模態人工智慧在產業的落地應用後，我再次體會到這股變革巨浪的猛烈。從日常的程式碼撰寫、大綱整理，到進步到設計行銷文案或協助學術文獻的摘要，生成式 AI 工具不僅僅是輔助工具，更徹底重塑了「人機協同」的工作範式。",
      "在課堂的實作專案中，我曾多次面臨開發邏輯上的卡關，然而藉由與 AI 持續進行結構化的對話（Prompt Engineering），往往能在幾分鐘內釐清盲點，並產出高效率的實做代碼。這種全新的學習體驗是前所未有的——AI 扮演了一個 24 小時無休且耐心無窮的個人導師。當然，這也引發了我的深思：當資訊獲取和程式撰寫變得如此低門檻，我們的核心價值究竟在哪裡？我認為，未來的競爭力不再是拼死記硬背，而是提出好問題的「提問力」與對產出內容進行縝密邏輯檢查的「批判思維能力」。",
      "展望未來，人工智慧無疑會在醫學、金融以及各個工程學科中扮演更加主導的角色。身為資訊領域的學生，不能僅止於當一個技術的使用者或旁觀者。我們必須主動掌握大氣底層模型的訓練原理、微調策略（Fine-tuning）以及語意搜尋 RAG 技術，並時常保持跨領域的敏感度，方能在未來百變的浪潮中，立於科技發展的浪頭之上。而本次報告正是我在此學習歷程中的一塊基石。"
    ],
    highlightTitle: "本週學習核心心得總結",
    highlightContent: "「未來的核心競爭力不再是單純的代碼輸出或知識儲存，而是針對複雜問題拆解的提問力（Prompting）與對結果精準覆核的判斷力。我們必須與 AI 保持健康的協同關係，將其作為大腦的增強器，而非思維的替代品。」"
  },
  toc: {
    title: "目錄 Table of Contents",
    subtitle: "數位時代 AI 工智慧的應用報告目錄",
    items: [
      { id: "1", title: "壹、 專案簡介與研究動機", pageNum: "1" },
      { id: "2", title: "貳、 當前 LLM 大型語言模型主流技術分析", pageNum: "2" },
      { id: "3", title: "參、 業界最新落地應用案例探討", pageNum: "3" },
      { id: "4", title: "肆、 AI 引發的倫理道德與智慧財產權爭議", pageNum: "3" },
      { id: "5", title: "伍、 學習課程所得與心得反思", pageNum: "4" },
      { id: "6", title: "陸、 學生與 AI 協同作業實作程式展示", pageNum: "4" },
      { id: "7", title: "柒、 參考文獻與未來展望", pageNum: "4" }
    ]
  },
  assignment: {
    title: "實作作業與附件展示區",
    intro: "以下為本次作業的程式實作截圖、代碼片段以及程式執行數據記錄。本實作以 PyTorch 進行簡單的自定義 Transformer 情緒分析模型訓練，並匯出其注意力權重矩陣（Attention Matrix）之熱點圖，展現深度學習的可解釋性。",
    files: [
      {
        id: "sample-img-1",
        name: "attention_weight_heatmap.png",
        type: "image/png",
        dataUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        caption: "圖 1.1：情緒分析 Transformer 模型首層 self-attention 注意力權重熱點分布圖",
        description: "本熱圖反映了模型在處理含有強烈情感偏向詞彙（如 '驚艷'、'失望'）時，注意力機制如何將周圍語境進行加權配比的實作過程，證實語意聚焦的偏移情況。"
      }
    ],
    notes: "# 實驗步驟與結論紀錄\n1. 基於 15,000 筆 IMDB 影評中文翻譯資料集進行隨機打亂並切分三等份（訓練集/驗證集/測試集 = 7:2:1）。\n2. 訓練共進行 10 次 Epoch，權重優化器採用 AdamW (lr=3e-5) 搭配 Cosine Annealing 學習率排程控制。\n3. 優化後在獨立測試集獲得 91.24% 的正確率（Accuracy），比原經典 LSTM Baseline 模型提高了 4.81% 個百分點。\n4. 未來優化目標：計畫導入 LoRA 微調策略，於繁體中文專有語料（如 PTT / Dcard 討論串）進行二次預訓練，提昇對流行語及諷刺語氣的解讀精度。",
    notesTitle2: "高階客製化：四天極致行程規劃書",
    notes2: "Day 1：東京 · 空中殿堂與壽司之神\n下午： 私人飛機降落後，車隊直抵 Aman Tokyo（安縵東京），您將包下飯店頂層的所有套房，將整片東京天際線據為己有。\n\n三餐規劃：\n午餐： 在專機上享受由空中主廚現做、空運自北海島的「紅金魚子醬」配冰滴藍山咖啡。\n晚餐： 【私人包場】壽司之神「數寄屋橋次郎」。小野二郎（或其傳人）將整晚只服務您一人，所有頂級食材（如一公斤百萬日圓的鮪魚大腹）皆為今日拍賣市場最強之選。\n宵夜： 飯店頂層私人酒吧，由世界調酒冠軍現場為您調製 1950 年份珍稀麥卡倫特調。\n\nDay 2：京都 · 皇室禁地與古寺夜宴\n上午： 搭乘私人直升機橫跨富士山，降落在京都**「仁和寺」**後院。\n下午： 進入平時不對外開放的國寶級建築，由住持親自導覽，並在江戶時代的茶室中體驗由皇室茶師進行的茶禮。\n\n三餐規劃：\n早餐： 在安縵東京套房內享用「松露極上歐姆蛋」。\n午餐： 京都「菊乃井 本店」包廂。品嚐獲得米其林三星的懷石料理，主廚村田吉弘將親自為您說菜。\n晚餐： 【獨家】二條城私人夜宴。我們已獲得特許，在世界文化遺產二條城內封場，安排一場江戶風格的私人晚宴，伴隨藝伎與武士道劍術表演。\n\nDay 3：九州 · 鐵道上的移動城堡\n全天： 包下整台 「九州七星號 (Seven Stars)」豪華臥鋪火車。這列火車平時需抽籤且一位難求，但我們包下全車 10 間套房，整輛列車只為您服務，行駛於九州最美的山海線。\n\n三餐規劃：\n早餐： 列車上的移動晨曦餐，使用阿蘇火山地帶的稀有時令蔬菜。\n午餐： 列車內的「車頭景觀餐廳」，由九州頂尖名廚現場料理「宮崎牛」牛排。\n晚餐： 列車停靠私人秘境車站，在星空下進行露天炭火晚宴，搭配現場大提琴與鋼琴獨奏。\n\nDay 4：東京 · 全球選物與凱旋歸航\n上午： 列車返回福岡後，搭乘直升機飛回東京。\n下午： 【銀座封館購物】。銀座頂級百貨公司為您提前一小時閉館，所有 2026 年最新款精品與稀有珠寶皆準備妥當供您挑選。\n\n三餐規劃：\n早餐： 九州頂級晨摘水果與特製燕窩粥。\n午餐： 米其林三星「麻布 幸村」。品嚐當季最珍貴的「間人蟹」或「丹波松茸」。\n下午茶： 於私人飛機庫舉辦的小型告別宴，提供 2026 年限定款法國皇室甜點。\n返程： 帶著所有戰利品，私人專機在戰機護航下升空返航。",
    portalUrl: "https://sites.google.com/nkust.edu.tw/jalsjasljddjoaidjpafjpfkpakf/%E9%A6%96%E9%A0%81#h.b18zj4domaem",
    portalUrlImage: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1200",
    portalUrlTitle: "國立高雄科技大學（NKUST）自主學習專題平台 · 歷程節點",
    portalUrlDesc: "本外部專題成果整合 Google Sites 平台之特別許可學習歷程節點。主要展示了針對未來精英差旅與日本頂級文化融合（Aman Tokyo、壽司之神、二條城私人夜宴與豪華七星火車）的科技化輔助決策，具體探討人機協同在自動行程生成與精密預算審查上的實務落地。",
    tripoUrl: "https://studio.tripo3d.ai/3d-model/b5345719-2b38-4dd1-b077-6ee1cb4cafb2?invite_code=HF6UKF",
    tripoUrlImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    tripoUrlTitle: "Tripo3D 智慧生成數位雙生 · 3D 動態模型節點",
    tripoUrlDesc: "本外部 3D 模型節點整合 Tripo3D 智慧生成平台。透過高精度 AI 演算法，針對未來智慧差旅載具、頂奢空間格局與歷史文化地標進行 3D 擬真建模，提供沈浸式的立體視覺呈現與空間關係解析。"
  }
};

export const THEMES: ThemeStyles[] = [
  {
    id: 'academic',
    name: '古典學術藍',
    fontTitle: 'font-serif',
    fontBody: 'font-serif',
    borderColor: 'border-[#1e3a8a] text-[#1e3a8a]',
    accentBg: 'bg-[#1e3a8a]',
    accentText: 'text-[#1e3a8a]',
    coverLayout: 'academic'
  },
  {
    id: 'modern',
    name: '現代科技青',
    fontTitle: 'font-display font-bold',
    fontBody: 'font-sans',
    borderColor: 'border-[#0f766e] text-[#0f766e]',
    accentBg: 'bg-[#0f766e]',
    accentText: 'text-[#0f766e]',
    coverLayout: 'modern'
  },
  {
    id: 'elegant',
    name: '人文精緻絳',
    fontTitle: 'font-serif italic font-bold',
    fontBody: 'font-serif',
    borderColor: 'border-[#991b1b] text-[#991b1b]',
    accentBg: 'bg-[#991b1b]',
    accentText: 'text-[#991b1b]',
    coverLayout: 'elegant'
  },
  {
    id: 'minimalist',
    name: '極簡現代黑',
    fontTitle: 'font-mono uppercase font-bold tracking-widest',
    fontBody: 'font-sans',
    borderColor: 'border-neutral-900 text-neutral-900',
    accentBg: 'bg-neutral-900',
    accentText: 'text-neutral-900',
    coverLayout: 'minimalist'
  }
];
