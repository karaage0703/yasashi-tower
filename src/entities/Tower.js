/**
 * Tower - プレイヤーが設置するタワークラス
 */
class Tower {
    /**
     * コンストラクタ
     * 
     * @param {Phaser.Scene} scene - シーン
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {Object} config - 設定（オプション）
     */
    constructor(scene, x, y, config = {}) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // タワーのプロパティ
        this.range = config.range || 150;      // 攻撃範囲
        this.damage = config.damage || 10;     // 攻撃力
        this.attackSpeed = config.speed || 1;  // 攻撃速度（秒間の攻撃回数）
        this.attackCooldown = 0;               // 攻撃クールダウン
        
        // 活性状態
        this.active = true;
        
        // スプライトの作成
        this.sprite = scene.add.image(x, y, 'tower').setScale(0.8);
        
        // 攻撃範囲の可視化（開発用）
        this.rangeCircle = scene.add.circle(x, y, this.range, 0x0000ff, 0.1);
        
        // ゲームマネージャーに登録
        if (scene.gameManager) {
            scene.gameManager.towerPlaced(this);
        }
        
        console.log(`Tower created at (${x}, ${y})`);
    }

    /**
     * 更新処理
     * 
     * @param {number} delta - 経過時間
     */
    update(delta) {
        if (!this.active) return;
        
        // クールダウン更新
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta || 1/60;
        }
        
        // 攻撃可能状態なら最も近い敵を攻撃
        if (this.attackCooldown <= 0) {
            const enemy = this.findNearestEnemy();
            if (enemy) {
                this.attack(enemy);
            }
        }
    }

    /**
     * 最も近い敵を見つける
     * 
     * @returns {Enemy|null} 最も近い敵、または範囲内に敵がない場合はnull
     */
    findNearestEnemy() {
        if (!this.scene.enemies || this.scene.enemies.length === 0) {
            return null;
        }
        
        let nearestEnemy = null;
        let shortestDistance = this.range + 1; // 範囲外の値で初期化
        
        for (let i = 0; i < this.scene.enemies.length; i++) {
            const enemy = this.scene.enemies[i];
            
            if (enemy && enemy.active) {
                const distance = Phaser.Math.Distance.Between(
                    this.x, this.y,
                    enemy.x, enemy.y
                );
                
                if (distance <= this.range && distance < shortestDistance) {
                    nearestEnemy = enemy;
                    shortestDistance = distance;
                }
            }
        }
        
        return nearestEnemy;
    }

    /**
     * 敵を攻撃する
     * 
     * @param {Enemy} enemy - 攻撃対象の敵
     */
    attack(enemy) {
        if (!this.active || !enemy || !enemy.active) return;
        
        console.log(`Tower attacks enemy at (${enemy.x}, ${enemy.y})`);
        
        // 攻撃エフェクト（仮の実装）
        const line = this.scene.add.line(
            0, 0,
            this.x, this.y,
            enemy.x, enemy.y,
            0xff0000
        ).setOrigin(0, 0);
        
        // エフェクトを短時間で消す
        this.scene.time.delayedCall(100, () => {
            line.destroy();
        });
        
        // ダメージを与える
        enemy.takeDamage(this.damage);
        
        // クールダウンを設定
        this.attackCooldown = 1 / this.attackSpeed;
    }

    /**
     * タワーの活性状態を設定
     * 
     * @param {boolean} isActive - 活性状態
     */
    setActive(isActive) {
        this.active = isActive;
        
        if (this.sprite) {
            this.sprite.setAlpha(isActive ? 1 : 0.5);
        }
    }

    /**
     * タワーを破棄する
     */
    destroy() {
        this.active = false;
        
        if (this.sprite) {
            this.sprite.destroy();
        }
        
        if (this.rangeCircle) {
            this.rangeCircle.destroy();
        }
    }

    /**
     * タワーのアップグレード（拡張機能）
     * 
     * @param {Object} upgrades - アップグレード内容
     */
    upgrade(upgrades = {}) {
        // ダメージ上昇
        if (upgrades.damage) {
            this.damage += upgrades.damage;
        }
        
        // 範囲拡大
        if (upgrades.range) {
            this.range += upgrades.range;
            
            // 範囲表示を更新
            if (this.rangeCircle) {
                this.rangeCircle.setRadius(this.range);
            }
        }
        
        // 攻撃速度上昇
        if (upgrades.speed) {
            this.attackSpeed += upgrades.speed;
        }
        
        console.log('Tower upgraded');
    }
}