package com.teamgram.admin.model;

import lombok.Data;

@Data
public class User {
    private Long userId;
    private String phone;
    private String firstName;
    private String lastName;
    private String username;
    private Boolean deleted;
    private Long createdAt;
}
