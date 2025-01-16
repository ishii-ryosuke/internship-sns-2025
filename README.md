# internship-sns-2025

## 環境構築
### 必要なツール
以下がインストールされていることを確認してください：
- **Node.js**（推奨バージョン: 16 以上）
- **npm**（Node.js に含まれます）
- **Firebase CLI**（以下の手順でインストール）

### 構築手順
以下の手順は既に Firebase プロジェクトが作成されていることが前提となっています。

1. Firebase CLI のインストール  
Firebase CLI をインストールします
    ```
    npm install -g firebase-tools
    ```
2. Firebase にログイン  
Firebase アカウントにログインします（コマンド実行後、表示されたブラウザでログインするアカウントの認証情報を入力する）
    ```
    firebase login
    ```

3. .firebaserc の編集  
このディレクトリと紐づける Firebase プロジェクトを指定します。  
.firebaserc を開き、XXXXXXXXXの箇所を置き換えます。
    ```
    {
      "projects": {
        "default": "XXXXXXXXX"
      }
    }
    ```
    置き換える内容はブラウザでFirebaseプロジェクトを表示した際のURLから確認できます。  
    以下のXXXXXXXXXが置き換える内容に該当します。
    ```
    https://console.firebase.google.com/u/0/project/XXXXXXXXX/overview?hl=ja
    ```

4. Firebase API キーの設定  
`./src/firebase-wrapper/index.js` の以下の箇所を作成した Firebase プラジェクトの内容に置き換えてください。
    ```js
    // TODO: 作成した Firebase プロジェクトの設定に置き換える
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

## デプロイ
デプロイ（アプリを公開）は以下のコマンドで実行できます。
```
firebase deploy
```

## ディレクトリ構成
```
.
├── README.md                   # プロジェクトの説明書
├── firebase.json               # Firebase Hosting 設定
├── package.json                # npm パッケージ情報
├── src/                        # アプリのソースコード
│   ├── html/                   # HTML ファイル
│   ├── script/                 # JavaScript ファイル
│   ├── asset/                  # 画像や CSS
│   └── firebase-wrapper/       # Firebase 設定とラッパー
└── tailwind.config.js          # Tailwind CSS 設定
```

