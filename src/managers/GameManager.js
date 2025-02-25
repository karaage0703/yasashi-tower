/**
 * GameManager - ゲーム全体の管理を行うクラス
 */
class GameManager {
    /**
     * コンストラクタ
     * 
     * @param {Phaser.Scene} scene - 管理対象のシーン
     */
    constructor(scene) {
        this.scene = scene;
        this.isGameActive = false;
        this.init();
    }

    /**
     * 初期化処理
     */
    init() {
        console.log('GameManager initialized');
        this.isGameActive = true;
    }

    /**
     * ゲーム開始処理
     */
    startGame() {
        if (!this.isGameActive) {
            this.isGameActive = true;
            
            // 初期化処理
            this.scene.lives = 10;
            this.scene.score = 0;
            this.scene.currentWave = 1;
            
            // UI更新
            this.scene.updateUI();
            
            console.log('Game started');
        }
    }

    /**
     * ゲーム更新処理
     * 
     * @param {number} delta - 前フレームからの経過時間
     */
    update(delta) {
        if (this.isGameActive) {
            // 必要に応じて全体的な更新処理を行う
            // 例：時間経過による処理、特殊イベントの発生など
        }
    }

    /**
     * ゲーム終了処理
     * 
     * @param {boolean} isWin - 勝利フラグ
     */
    endGame(isWin) {
        if (this.isGameActive) {
            this.isGameActive = false;
            
            if (isWin) {
                console.log('Game won!');
                this.scene.gameWin();
            } else {
                console.log('Game over!');
                this.scene.gameOver();
            }
        }
    }

    /**
     * 敵を倒した時の処理
     * 
     * @param {Enemy} enemy - 倒された敵
     */
    enemyDefeated(enemy) {
        // スコア加算などの処理
        this.scene.enemyDefeated(enemy);
    }

    /**
     * 敵がゴールに到達した時の処理
     * 
     * @param {Enemy} enemy - ゴールに到達した敵
     */
    enemyReachedGoal(enemy) {
        this.scene.enemyReachedGoal(enemy);
        
        // ライフが0になったらゲーム終了
        if (this.scene.lives <= 0) {
            this.endGame(false);
        }
    }

    /**
     * ウェーブ完了時の処理
     */
    waveComplete() {
        // 最終ウェーブクリア時はゲームクリア
        if (this.scene.currentWave >= this.scene.totalWaves) {
            this.endGame(true);
        } else {
            // 次のウェーブへ
            this.scene.waveComplete();
        }
    }

    /**
     * タワー設置時の処理
     * 
     * @param {Tower} tower - 設置されたタワー
     */
    towerPlaced(tower) {
        // 必要に応じてタワー設置に関連する処理
        console.log(`Tower placed at (${tower.x}, ${tower.y})`);
    }
}