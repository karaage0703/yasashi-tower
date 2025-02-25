/**
 * GameScene - メインのゲームプレイシーン
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // ゲーム状態
        this.towers = [];
        this.enemies = [];
        this.lives = 10;
        this.score = 0;
        this.currentWave = 1;
        this.totalWaves = 5;
        this.isWaveActive = false;
        
        // タワー設置の制限
        this.maxTowers = 5;         // 最大設置可能数
        this.remainingTowers = 5;   // 残りの設置可能数
        
        // UI要素
        this.lifeText = null;
        this.waveText = null;
        this.scoreText = null;
        this.towerCountText = null; // タワー設置可能数表示
    }

    create() {
        // ゲームマネージャーの初期化
        this.gameManager = new GameManager(this);
        
        // 背景の設定
        this.add.image(400, 300, 'background');

        // マップの作成
        this.createMap();
        
        // UI要素の作成
        this.createUI();
        
        // タワー設置の入力処理
        this.input.on('pointerdown', (pointer) => {
            // タワー設置可能エリアをクリックした場合
            if (this.isTowerPlacementValid(pointer.x, pointer.y)) {
                this.placeTower(pointer.x, pointer.y);
            }
        });
        
        // 初期化
        this.lives = this.registry.get('lives');
        this.currentWave = this.registry.get('currentWave');
        this.totalWaves = this.registry.get('totalWaves');
        this.score = this.registry.get('score');
        
        // UI更新
        this.updateUI();
        
        // 初期ウェーブの開始（少し遅延させる）
        this.time.delayedCall(2000, () => {
            this.startWave();
        });
    }

    update() {
        // 敵の移動更新
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].active) {
                this.enemies[i].move();
            }
        }
        
        // タワーの攻撃更新
        for (let i = 0; i < this.towers.length; i++) {
            if (this.towers[i].active) {
                this.towers[i].update();
            }
        }
        
        // ウェーブ完了チェック
        if (this.isWaveActive && this.enemies.length === 0) {
            this.waveComplete();
        }
    }

    /**
     * マップを作成する
     */
    createMap() {
        // プレイスホルダー用の簡易マップ
        // 実際の開発では適切なマップタイルや経路を設定する
        
        // 敵の経路（例）
        this.path = [
            { x: 0, y: 200 },
            { x: 200, y: 200 },
            { x: 200, y: 400 },
            { x: 600, y: 400 },
            { x: 600, y: 200 },
            { x: 800, y: 200 }
        ];
        
        // 経路の可視化（開発用）
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xff0000, 1);
        graphics.beginPath();
        graphics.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            graphics.lineTo(this.path[i].x, this.path[i].y);
        }
        
        graphics.strokePath();
    }

    /**
     * UI要素を作成する
     */
    createUI() {
        // ライフ表示
        this.lifeText = this.add.text(20, 20, `ライフ: ${this.lives}`, {
            font: '18px Arial',
            fill: '#000000'
        });
        
        // ウェーブ表示
        this.waveText = this.add.text(20, 50, `ウェーブ: ${this.currentWave}/${this.totalWaves}`, {
            font: '18px Arial',
            fill: '#000000'
        });
        
        // スコア表示
        this.scoreText = this.add.text(20, 80, `スコア: ${this.score}`, {
            font: '18px Arial',
            fill: '#000000'
        });
        
        // タワー設置可能数表示
        this.towerCountText = this.add.text(20, 110, `タワー: ${this.remainingTowers}/${this.maxTowers}`, {
            font: '18px Arial',
            fill: '#000000'
        });
        
        // タワー設置ボタン
        const towerButton = this.add.image(720, 50, 'tower').setScale(0.8);
        towerButton.setInteractive();
        
        towerButton.on('pointerdown', () => {
            // タワー選択モードの切り替え（実装は省略）
            console.log('タワー設置モード');
        });
        
        // ゲームスピード変更ボタン（必要に応じて）
        // ...
    }

    /**
     * UI要素を更新する
     */
    updateUI() {
        if (this.lifeText) this.lifeText.setText(`ライフ: ${this.lives}`);
        if (this.waveText) this.waveText.setText(`ウェーブ: ${this.currentWave}/${this.totalWaves}`);
        if (this.scoreText) this.scoreText.setText(`スコア: ${this.score}`);
        if (this.towerCountText) this.towerCountText.setText(`タワー: ${this.remainingTowers}/${this.maxTowers}`);
    }

    /**
     * タワーを設置する
     */
    placeTower(x, y) {
        // タワー設置数の制限チェック
        if (this.remainingTowers <= 0) {
            // 設置可能数を超えている場合は警告表示
            this.showWarningMessage("タワーの設置上限に達しました");
            return;
        }
        
        // 座標を適切なグリッドにスナップ
        const gridSize = 50;
        const gridX = Math.floor(x / gridSize) * gridSize + gridSize / 2;
        const gridY = Math.floor(y / gridSize) * gridSize + gridSize / 2;
        
        // 新しいタワーを作成
        const tower = new Tower(this, gridX, gridY);
        this.towers.push(tower);
        
        // 残りのタワー設置可能数を減らす
        this.remainingTowers--;
        
        // UI更新
        this.updateUI();
    }
    
    /**
     * 警告メッセージを表示する
     */
    showWarningMessage(message) {
        // 既存の警告メッセージがあれば削除
        if (this.warningText) {
            this.warningText.destroy();
        }
        
        // 新しい警告メッセージを表示
        this.warningText = this.add.text(
            this.cameras.main.width / 2,
            150,
            message,
            {
                font: 'bold 20px Arial',
                fill: '#ff0000'
            }
        ).setOrigin(0.5);
        
        // 数秒後に自動的に消える
        this.time.delayedCall(2000, () => {
            if (this.warningText) {
                this.warningText.destroy();
                this.warningText = null;
            }
        });
    }

    /**
     * タワー設置位置が有効かチェック
     */
    isTowerPlacementValid(x, y) {
        // 経路上には設置できない
        // 他のタワーがある場所には設置できない
        // 画面外には設置できない
        
        // ここでは簡易的な判定のみ
        // 実際の開発では精度の高い判定が必要
        
        // 画面内かチェック
        if (x < 0 || x > 800 || y < 0 || y > 600) {
            return false;
        }
        
        // 経路から一定距離離れているかチェック
        for (let i = 0; i < this.path.length - 1; i++) {
            const start = this.path[i];
            const end = this.path[i + 1];
            
            // 線分との距離を計算（簡略化）
            const d = this.distanceToLine(x, y, start.x, start.y, end.x, end.y);
            if (d < 30) {  // 経路から30px以内は設置不可
                return false;
            }
        }
        
        // 他のタワーとの重複チェック
        for (let i = 0; i < this.towers.length; i++) {
            const tower = this.towers[i];
            const distance = Phaser.Math.Distance.Between(x, y, tower.x, tower.y);
            if (distance < 50) {  // タワー同士は50px以上離す
                return false;
            }
        }
        
        return true;
    }

    /**
     * 点と線分の最短距離を計算
     */
    distanceToLine(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        
        if (len_sq !== 0) {
            param = dot / len_sq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 敵を生成する
     */
    spawnEnemy() {
        const enemy = new Enemy(this, this.path);
        this.enemies.push(enemy);
    }

    /**
     * ウェーブを開始する
     */
    startWave() {
        this.isWaveActive = true;
        
        // 現在のウェーブに応じた敵の数
        const enemyCount = 5 + this.currentWave * 2;
        
        // 敵を一定間隔で出現させる
        for (let i = 0; i < enemyCount; i++) {
            this.time.delayedCall(i * 1000, () => {  // 1秒ごとに敵を出現
                this.spawnEnemy();
            });
        }
    }

    /**
     * ウェーブ完了時の処理
     */
    waveComplete() {
        this.isWaveActive = false;
        
        // スコア加算
        this.score += 100 * this.currentWave;
        this.updateUI();
        
        // 次のウェーブがあれば開始
        if (this.currentWave < this.totalWaves) {
            this.currentWave++;
            this.updateUI();
            
            // 次のウェーブまで少し待機
            this.time.delayedCall(3000, () => {
                this.startWave();
            });
        } else {
            // 全ウェーブクリア
            this.gameWin();
        }
    }

    /**
     * 敵がゴールに到達した時の処理
     */
    enemyReachedGoal(enemy) {
        // 敵をリストから削除
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
        
        // ライフを減らす
        this.lives--;
        
        // UI更新
        this.updateUI();
        
        // ゲームオーバーチェック
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    /**
     * 敵を倒した時の処理
     */
    enemyDefeated(enemy) {
        // スコア加算
        this.score += 10;
        
        // UI更新
        this.updateUI();
        
        // 敵をリストから削除
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    /**
     * ゲームオーバー処理
     */
    gameOver() {
        // スコアを保存
        this.registry.set('score', this.score);
        
        // ゲームオーバーシーンへ
        this.scene.start('GameOverScene', { won: false });
    }

    /**
     * ゲームクリア処理
     */
    gameWin() {
        // スコアを保存
        this.registry.set('score', this.score);
        
        // ゲームオーバーシーンへ（勝利フラグ付き）
        this.scene.start('GameOverScene', { won: true });
    }
}