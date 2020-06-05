// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private ArrayList<String> comments;

  public DataServlet() {
    comments = new ArrayList<>(3);
    comments.add("Hello!");
    comments.add("Nice to meet you!");
    comments.add("Have a nice day!");
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String json = convertToJson(comments);
    response.setContentType("text/html;");
    response.getWriter().println(json);
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String userComment = request.getParameter("comment-input");
    long timestamp = System.currentTimeMillis();

    // Uses a hidden form to get the page the user sent the request from
    // Allows redirect to work correctly even if comments section is present on multiple pages
    String pageToRedirect = request.getParameter("page-name");
    
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("text", userComment);
    commentEntity.setProperty("time", timestamp);
    
    // TODO remove once code is able to read from database
    comments.add(0, userComment);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    response.sendRedirect(pageToRedirect);
  }

  /** Takes an object and returns a JSON (string) representation of it */
  private String convertToJson(Object obj) {
    Gson gson = new Gson();
    String json = gson.toJson(obj);
    return json;
  }
  
}