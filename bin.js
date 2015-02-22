/*
*   This is where all the old code goes that could be re-used

,

                    //The steps to move in each direction if a collision occured
                    stepX,
                    stepY,

                    //If the sprite collides keep the new moved positions
                    newX,
                    newY;



this.y += this.vy * delta;

                    //Set the flags
                    this.collidedUp = this.collidesTop(collisionFunction);
                    this.collidedDown = this.collidesBottom(collisionFunction);

                    this.x += this.vx * delta;

                    this.collidedLeft = this.collidesLeft(collisionFunction);
                    this.collidedRight = this.collidesRight(collisionFunction);

                    if (this.collidedUp || this.collidedLeft || this.collidedDown || this.collidedRight) {

                        stepX = (this.x - oldX) / this.collisionSteps;
                        stepY = (this.y - oldY) / this.collisionSteps;

                        if (this.collidedUp || this.collidedDown) {
                            this.vy = 0;

                            if (this.collidedDown) {
                                this.jumping = false;
                                this.falling = false;
                            }

                            do {
                                this.y -= stepY;
                            } while (this.collidesBottom(collisionFunction) || this.collidesTop(collisionFunction));

                        }


                        if (this.collidedLeft || this.collidedRight) {
                            this.vx = 0;

                            do {
                                this.x -= stepX;
                            } while (this.collidesLeft(collisionFunction) || this.collidesRight(collisionFunction));
                        }

                        if ((this.vx > 0 && this.x < oldX) || (this.vx < 0 && this.x > oldX)) {
                            this.x = oldX;
                        }

                        if ((this.vy > 0 && this.y < oldY) || (this.vy < 0 && this.y > oldY)) {
                            this.y = oldY;
                        }
                    } else {
                        this.falling = true;
                    }






*/
