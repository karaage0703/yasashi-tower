/**
 * GameOverScene - ゲームオーバーまたはクリア時の画面
 */
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        // 勝敗情報を受け取る
        this.isWin = data.won || false;
    }

    create() {
        // 背景
        this.add.image(400, 300, 'background');

        // スコア取得
        const score = this.registry.get('score');

        // タイトルテキスト（勝敗に応じて変更）
        const titleText = this.isWin ? 'ゲームクリア！' : 'ゲームオーバー';
        const titleColor = this.isWin ? '#007700' : '#770000';

        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 3,
            titleText,
            {
                font: 'bold 48px Arial',
                fill: titleColor
            }
        ).setOrigin(0.5);

        // スコア表示
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            `スコア: ${score}`,
            {
                font: '32px Arial',
                fill: '#000000'
            }
        ).setOrigin(0.5);

        // リトライボタン
        const retryButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 100,
            'button'
        ).setScale(2);
        
        // ボタンテキスト
        this.add.text(
            retryButton.x,
            retryButton.y,
            'もう一度プレイ',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // ボタンにインタラクティブ設定
        retryButton.setInteractive();
        
        // ホバーエフェクト
        retryButton.on('pointerover', () => {
            retryButton.setTint(0xaaaaaa);
        });
        
        retryButton.on('pointerout', () => {
            retryButton.clearTint();
        });
        
        // クリックでゲームをリセットしてタイトルへ
        retryButton.on('pointerdown', () => {
            // ゲーム状態のリセット
            this.registry.set('score', 0);
            this.registry.set('lives', 10);
            this.registry.set('currentWave', 1);
            
            // タイトル画面へ戻る
            this.scene.start('TitleScene');
        });

        // タイトルへ戻るボタン
        const titleButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 180,
            'button'
        ).setScale(2);
        
        // ボタンテキスト
        this.add.text(
            titleButton.x,
            titleButton.y,
            'タイトルへ',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // ボタンにインタラクティブ設定
        titleButton.setInteractive();
        
        // ホバーエフェクト
        titleButton.on('pointerover', () => {
            titleButton.setTint(0xaaaaaa);
        });
        
        titleButton.on('pointerout', () => {
            titleButton.clearTint();
        });
        
        // クリックでタイトルへ
        titleButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
    }
}