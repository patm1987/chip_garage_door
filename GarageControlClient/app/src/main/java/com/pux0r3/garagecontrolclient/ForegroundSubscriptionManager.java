package com.pux0r3.garagecontrolclient;

import android.app.Activity;
import android.content.IntentSender;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageListener;
import com.google.android.gms.nearby.messages.Strategy;
import com.google.android.gms.nearby.messages.SubscribeCallback;
import com.google.android.gms.nearby.messages.SubscribeOptions;

/**
 * Created by pux19 on 2/16/2016.
 */
public class ForegroundSubscriptionManager extends MessageListener implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
	private static final String LOG_TAG = "FSM";

	private final GoogleApiClient _googleApiClient;
	private final Activity _activity;

	public ForegroundSubscriptionManager(Activity activity) {
		_googleApiClient = new GoogleApiClient.Builder(activity)
				.addApi(Nearby.MESSAGES_API)
				.addConnectionCallbacks(this)
				.addOnConnectionFailedListener(this)
				.build();
		_activity = activity;
	}

	public void connect() {
		_googleApiClient.connect();
	}

	public void disconnect() {
		_googleApiClient.disconnect();
	}

	@Override
	public void onConnected(Bundle bundle) {
		Log.i(LOG_TAG, "Connected!");

		subscribeToMessages();
	}

	private void subscribeToMessages() {
		SubscribeOptions options = new SubscribeOptions.Builder()
				.setStrategy(Strategy.BLE_ONLY)
				.setCallback(new SubscribeCallback() {

					@Override
					public void onExpired() {
						super.onExpired();
					}
				}).build();
		Nearby.Messages.subscribe(_googleApiClient, this, options)
				.setResultCallback(new ResultCallback<Status>() {
					@Override
					public void onResult(@NonNull Status status) {
						if (status.isSuccess()) {
							Log.i(LOG_TAG, "Succeeded in connecting!");
						} else {
							Log.i(LOG_TAG, "Failed to connect");
							if (status.hasResolution()) {
								try {
									status.startResolutionForResult(_activity, Constants.REQUEST_RESOLVE_ERROR);
								} catch (IntentSender.SendIntentException e) {
									e.printStackTrace();
								}
							}
						}
					}
				});
	}

	@Override
	public void onConnectionSuspended(int i) {
		Log.i(LOG_TAG, "Connection Suspended!");
	}

	@Override
	public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
		Log.i(LOG_TAG, "Connection Failed because " + connectionResult);
	}

	@Override
	public void onFound(Message message) {
		Log.i(LOG_TAG, "Found message " + message);
	}

	public void ResolveError(int resultCode) {
		if (resultCode == Activity.RESULT_OK) {
			Log.i(LOG_TAG, "Connection accepted!");
			subscribeToMessages();
		} else if (resultCode == Activity.RESULT_CANCELED) {
			Log.e(LOG_TAG, "User Refused Permission");
		}
	}
}
