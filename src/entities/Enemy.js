/**
 * Enemy - ルートに沿って移動する敵クラス
 */
class Enemy {
    /**
     * コンストラクタ
     * 
     * @param {Phaser.Scene} scene - シーン
     * @param {Array} path - 移動経路の座標配列 [{x, y}, ...]
     * @param {Object} config - 設定（オプション）
     */
    constructor(scene, path, config = {}) {
        this.scene = scene;
        this.path = path;
        
        // 敵のプロパティ
        this.speed = config.speed || 1;       // 移動速度
        this.health = config.health || 100;    // HP
        this.maxHealth = this.health;          // 最大HP
        this.reward = config.reward || 10;     // 倒した時の報酬
        
        // 位置情報
        this.pathIndex = 0;                  // 現在の経路インデックス
        this.x = path[0].x;                  // X座標
        this.y = path[0].y;                  // Y座標
        this.nextX = path[1].x;              // 次の目標X座標
        this.nextY = path[1].y;              // 次の目標Y座標
        
        // 活性状態
        this.active = true;
        
        // スプライトの作成
        this.sprite = scene.add.image(this.x, this.y, 'enemy').setScale(0.7);
        
        // HPバーの作成
        this.createHealthBar();
        
        console.log(`Enemy created at (${this.x}, ${this.y})`);
    }

    /**
     * 更新処理 - 移動
     */
    move() {
        if (!this.active) return;
        
        // 現在地から次のポイントへの方向を計算
        const dx = this.nextX - this.x;
        const dy = this.nextY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 目標に到達したかチェック
        if (distance < this.speed) {
            // 次の経路ポイントへ
            this.pathIndex++;
            
            // 経路の終点に到達した場合
            if (this.pathIndex >= this.path.length - 1) {
                this.reachedGoal();
                return;
            }
            
            // 次の目標を設定
            this.x = this.path[this.pathIndex].x;
            this.y = this.path[this.pathIndex].y;
            this.nextX = this.path[this.pathIndex + 1].x;
            this.nextY = this.path[this.pathIndex + 1].y;
        } else {
            // 目標に向かって移動
            const vx = dx / distance;
            const vy = dy / distance;
            
            this.x += vx * this.speed;
            this.y += vy * this.speed;
        }
        
        // スプライトの更新
        if (this.sprite) {
            this.sprite.setPosition(this.x, this.y);
            
            // スプライトの回転（移動方向に向ける）
            if (dx !== 0 || dy !== 0) {
                this.sprite.setRotation(Math.atan2(dy, dx));
            }
        }
        
        // HPバーの更新
        this.updateHealthBar();
    }

    /**
     * ダメージを受ける
     * 
     * @param {number} amount - ダメージ量
     */
    takeDamage(amount) {
        if (!this.active) return;
        
        this.health -= amount;
        
        // HPバーの更新
        this.updateHealthBar();
        
        // HPが0以下になったら敵を倒す
        if (this.health <= 0) {
            this.defeat();
        }
    }

    /**
     * 敵が倒れた時の処理
     */
    defeat() {
        if (!this.active) return;
        
        this.active = false;
        
        console.log('Enemy defeated');
        
        // 爆発エフェクト（改善版）
        this.createExplosionEffect();
        
        // ゲームマネージャーに通知
        if (this.scene.gameManager) {
            this.scene.gameManager.enemyDefeated(this);
        } else {
            // 直接シーンに通知
            this.scene.enemyDefeated(this);
        }
        
        // スプライトの破棄
        this.destroy();
    }
    
    /**
     * 爆発エフェクトを作成
     */
    createExplosionEffect() {
        // 爆発の複数のパーティクル
        const particleColors = [0xff0000, 0xff7700, 0xffff00];
        const particleCount = 10;
        
        for (let i = 0; i < particleCount; i++) {
            // ランダムな色とサイズのパーティクル
            const size = Phaser.Math.Between(5, 10);
            const color = Phaser.Utils.Array.GetRandom(particleColors);
            
            // パーティクルの作成
            const particle = this.scene.add.circle(this.x, this.y, size, color);
            
            // ランダムな方向と速度
            const angle = Math.random() * Math.PI * 2;
            const speed = Phaser.Math.Between(1, 3);
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            
            // パーティクルのアニメーション
            this.scene.tweens.add({
                targets: particle,
                x: this.x + dx * 20,
                y: this.y + dy * 20,
                alpha: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 500,
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
        
        // 爆発の中心の閃光
        const flash = this.scene.add.circle(this.x, this.y, 15, 0xffffff);
        
        // 閃光のアニメーション
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 300,
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    /**
     * 敵がゴールに到達した時の処理
     */
    reachedGoal() {
        if (!this.active) return;
        
        this.active = false;
        
        console.log('Enemy reached goal');
        
        // ゲームマネージャーに通知
        if (this.scene.gameManager) {
            this.scene.gameManager.enemyReachedGoal(this);
        } else {
            // 直接シーンに通知
            this.scene.enemyReachedGoal(this);
        }
        
        // スプライトの破棄
        this.destroy();
    }

    /**
     * HPバーの作成
     */
    createHealthBar() {
        this.healthBarBackground = this.scene.add.rectangle(
            this.x,
            this.y - 20,
            30,
            5,
            0x000000
        );
        
        this.healthBar = this.scene.add.rectangle(
            this.x,
            this.y - 20,
            30,
            5,
            0x00ff00
        );
    }

    /**
     * HPバーの更新
     */
    updateHealthBar() {
        if (!this.healthBar || !this.healthBarBackground) return;
        
        // 位置の更新
        this.healthBarBackground.setPosition(this.x, this.y - 20);
        this.healthBar.setPosition(this.x, this.y - 20);
        
        // 幅の更新（HP割合）
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        this.healthBar.width = 30 * healthPercent;
        
        // 左寄せ
        this.healthBar.setOrigin(0.5, 0.5);
        
        // HPに応じて色を変更
        if (healthPercent < 0.3) {
            this.healthBar.fillColor = 0xff0000; // 赤
        } else if (healthPercent < 0.6) {
            this.healthBar.fillColor = 0xffff00; // 黄
        } else {
            this.healthBar.fillColor = 0x00ff00; // 緑
        }
    }

    /**
     * 敵の破棄
     */
    destroy() {
        this.active = false;
        
        if (this.sprite) {
            this.sprite.destroy();
        }
        
        if (this.healthBar) {
            this.healthBar.destroy();
        }
        
        if (this.healthBarBackground) {
            this.healthBarBackground.destroy();
        }
    }
}