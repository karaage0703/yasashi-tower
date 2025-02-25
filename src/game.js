/**
 * Yasashi Tower - メインゲームファイル
 * 
 * ゲームの初期化と設定を行う
 */

// ゲーム設定
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        GameScene,
        GameOverScene
    ]
};

// ゲーム初期化
window.addEventListener('load', () => {
    // ゲームインスタンスの作成
    const game = new Phaser.Game(config);
    
    // グローバルデータの初期化
    game.registry.set('score', 0);
    game.registry.set('lives', 10);
    game.registry.set('currentWave', 1);
    game.registry.set('totalWaves', 5);
});