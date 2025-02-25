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
        // 画像アセットの読み込み
        this.createTowerImage();  // タワー（砲台）の画像を生成
        this.createEnemyImage();  // 敵の画像を生成
        this.createColorImage('background', 800, 600, '#f0f0f0');  // 背景
        this.createButtonImage(); // ボタン画像を生成
        
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
    
    /**
     * タワー（砲台）の画像を生成する
     */
    createTowerImage() {
        const graphics = this.add.graphics();
        
        // タワーの土台
        graphics.fillStyle(0x666666, 1);
        graphics.fillRect(10, 35, 30, 15);
        
        // タワーの本体
        graphics.fillStyle(0x4a90e2, 1);
        graphics.fillRect(15, 15, 20, 20);
        
        // タワーの砲身
        graphics.fillStyle(0x333333, 1);
        graphics.fillRect(22, 5, 6, 25);
        
        // タワーの砲塔
        graphics.fillStyle(0x5a9ff2, 1);
        graphics.beginPath();
        graphics.arc(25, 15, 10, 0, 2 * Math.PI);
        graphics.closePath();
        graphics.fill();
        
        // ハイライト
        graphics.fillStyle(0xffffff, 0.5);
        graphics.beginPath();
        graphics.arc(22, 12, 3, 0, 2 * Math.PI);
        graphics.closePath();
        graphics.fill();
        
        // 画像をテクスチャとして保存
        graphics.generateTexture('tower', 50, 50);
        graphics.destroy();
    }
    
    /**
     * 敵の画像を生成する
     */
    createEnemyImage() {
        const graphics = this.add.graphics();
        
        // 敵の本体（三角形）
        graphics.fillStyle(0xe24a4a, 1);
        graphics.beginPath();
        graphics.moveTo(20, 0);
        graphics.lineTo(40, 30);
        graphics.lineTo(0, 30);
        graphics.closePath();
        graphics.fill();
        
        // 敵の目
        graphics.fillStyle(0xffffff, 1);
        graphics.beginPath();
        graphics.arc(15, 15, 4, 0, 2 * Math.PI);
        graphics.closePath();
        graphics.fill();
        
        graphics.fillStyle(0xffffff, 1);
        graphics.beginPath();
        graphics.arc(25, 15, 4, 0, 2 * Math.PI);
        graphics.closePath();
        graphics.fill();
        
        // 瞳
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.arc(15, 15, 2, 0, 2 * Math.PI);
        graphics.closePath();
        graphics.fill();
        
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.arc(25, 15, 2, 0, 2 * Math.PI);
        graphics.closePath();
        graphics.fill();
        
        // 画像をテクスチャとして保存
        graphics.generateTexture('enemy', 40, 40);
        graphics.destroy();
    }
    
    /**
     * ボタン画像を生成する
     */
    createButtonImage() {
        const graphics = this.add.graphics();
        
        // ボタンの背景
        graphics.fillStyle(0x4a90e2, 1);
        graphics.fillRect(0, 0, 100, 50);
        
        // ボタンの枠線
        graphics.lineStyle(2, 0x357abd, 1);
        graphics.strokeRect(0, 0, 100, 50);
        
        // ボタンのハイライト（上部）
        graphics.fillStyle(0xffffff, 0.3);
        graphics.fillRect(2, 2, 96, 10);
        
        // 画像をテクスチャとして保存
        graphics.generateTexture('button', 100, 50);
        graphics.destroy();
    }
}