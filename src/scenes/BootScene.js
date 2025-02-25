/**
 * BootScene - ゲームリソースの読み込みを行うシーン
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // ロード画面の表示
        this.createLoadingBar();

        // アセットの読み込み
        this.loadAssets();
    }

    create() {
        // リソースの読み込みが完了したらタイトル画面へ
        this.scene.start('TitleScene');
    }

    /**
     * ロード画面の表示
     */
    createLoadingBar() {
        // ロード中テキスト
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'ロード中...',
            {
                font: '24px Arial',
                fill: '#000000'
            }
        ).setOrigin(0.5);

        // プログレスバーの背景
        const progressBarBg = this.add.graphics();
        progressBarBg.fillStyle(0x222222, 0.8);
        progressBarBg.fillRect(
            this.cameras.main.width / 2 - 160,
            this.cameras.main.height / 2,
            320,
            30
        );

        // プログレスバー
        const progressBar = this.add.graphics();
        
        // ロード進捗イベント
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00aaff, 1);
            progressBar.fillRect(
                this.cameras.main.width / 2 - 150,
                this.cameras.main.height / 2 + 10,
                300 * value,
                10
            );
        });

        // ロード完了イベント
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBarBg.destroy();
        });
    }

    /**
     * アセットの読み込み
     */
    loadAssets() {
        // 画像アセットの読み込み - 色付きの矩形でプレースホルダーを代用
        this.createColorImage('tower', 50, 50, '#4a90e2');
        this.createColorImage('enemy', 40, 40, '#e24a4a');
        this.createColorImage('background', 800, 600, '#f0f0f0');
        this.createColorImage('button', 100, 50, '#4a90e2');
        
        // テキスト用のフォント読み込み（必要に応じて）
        
        // サウンド（必要に応じて）
        // this.load.audio('bgm', 'assets/sounds/bgm.mp3');
        // this.load.audio('shoot', 'assets/sounds/shoot.mp3');
    }
    
    /**
     * カラー画像を動的に生成する
     *
     * @param {string} key - 画像キー
     * @param {number} width - 幅
     * @param {number} height - 高さ
     * @param {string} color - 色（HTMLカラーコード）
     */
    createColorImage(key, width, height, color) {
        // 画像の生成
        const graphics = this.add.graphics();
        graphics.fillStyle(parseInt(color.replace('#', '0x')), 1);
        graphics.fillRect(0, 0, width, height);
        
        // 画像をテクスチャとして保存
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
}