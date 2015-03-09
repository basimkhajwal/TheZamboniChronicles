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




            //How many iterations to trace ray by each time
            collisionSteps: 25,

                        //Iterative update approach - OLD BECAUSE OF SOME BUGS THAT DIDNT WORK!!
            updateIter: function (delta, collisionFunction) {

                //Keep the total change(s) and the collisions
                var oldX = this.x,
                    oldY = this.y,

                    //The collision markers
                    anyCollisionLeft = false,
                    anyCollisionRight = false,
                    anyCollisionTop = false,
                    anyCollisionBottom = false;


                //If frame rate is less than specified amount then update at intervals instead
                while (delta > 0.018) {
                    //Update normally
                    this.tickUpdate(0.018, collisionFunction, oldX, oldY);

                    //Add to collisions
                    anyCollisionLeft = anyCollisionLeft || this.collidedLeft;
                    anyCollisionRight = anyCollisionRight || this.collidedRight;
                    anyCollisionTop = anyCollisionTop || this.collidedUp;
                    anyCollisionBottom = anyCollisionBottom || this.collidedDown;

                    //Min 0.018 from delta (what we just updated) and iterate if theres more left
                    delta -= 0.018;
                }

                //Update remaining delta
                this.tickUpdate(delta, collisionFunction, oldX, oldY);

                //Update change variables
                this.xChange = this.x - oldX;
                this.yChange = this.y - oldY;

                //Update collision markers
                this.collidedDown = anyCollisionBottom;
                this.collidedLeft = anyCollisionLeft;
                this.collidedRight = anyCollisionRight;
                this.collidedLeft = anyCollisionLeft;
            },



*/
