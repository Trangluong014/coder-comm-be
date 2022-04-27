# social-platform-mongo-express

## Description

A social platform web application built with MERN stack.
This is the codebase for the MongoDB NodeJS and Express RESTful backend API.

This is the solution for the full-stack web dev course @CoderSchoolVn

## Features

This include all common features of a Social Platform.

### Authentication and managing account (UserFlow)

- User can create account with email and password.
- User can login with email and password.
- User can see a list of all users.
- Owner can see own user information.
- User can see other user information by id.
- Owner can update own account profile.
- Owner can deactivate own account.

### CRUD post with friend only access (PostFlow)

- Authenticated user can make a post (POST a post).
- Authenticated user can see list of posts that belong to self and his/her friends.
- Authenticated user can update post by post's id.
- Authenticated user can delete post by post's id.
- Friends can see list of friend's post.

### CRUD comment and reaction for friend's post (InterationFlow)

- Friends can make comment (POST a comment) to other friend's post.
- Author of Comment can delete that comment.
- Author of Comment can update that comment.
- Authenticated user can see list of all comment belong to self and friend's post.
- Friend can react to each other's post.

### Managing friend (FriendFlow)

- Authenticated user can accept or reject a friend request.
- Authenticated user can see a list of all request received.
- Author can see a list of all request sent.
- Author of request can cancel the request.
- Authenticated user can see list of friend.
- Friend can unfriend.

## Production API:

- [Doc](https://app.swaggerhub.com/apis-docs/dhminh1024/CoderComm/1.0.0#/Reaction/createReaction)

- [App demo](https://codercomm-dot-cs-platform-306304.et.r.appspot.com/)

@copyright by CoderSchool.
