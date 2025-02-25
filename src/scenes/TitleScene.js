/**
 * TitleScene - ゲームのタイトル画面
 */
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // 背景
        this.add.image(400, 300, 'background').setScale(1);

        // タイトルテキスト
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 3,
            'Yasashi Tower',
            {
                font: 'bold 48px Arial',
                fill: '#000000'
            }
        ).setOrigin(0.5);

        // サブタイトル
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 3 + 60,
            'やさしいタワーディフェンスゲーム',
            {
                font: '24px Arial',
                fill: '#000000'
            }
        ).setOrigin(0.5);

        // スタートボタン
        const startButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 100,
            'button'
        ).setScale(2);
        
        // ボタンテキスト
        this.add.text(
            startButton.x,
            startButton.y,
            'ゲーム開始',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // ボタンにインタラクティブ設定
        startButton.setInteractive();
        
        // ホバーエフェクト
        startButton.on('pointerover', () => {
            startButton.setTint(0xaaaaaa);
        });
        
        startButton.on('pointerout', () => {
            startButton.clearTint();
        });
        
        // クリックでゲーム画面へ
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // 設定ボタン（必要に応じて）
        // ...
    }
}