package com.rajarsheechatterjee.NativeTTSMediaControl

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.lnreaderdev.spec.NativeTTSMediaControlSpec

class NativeTTSMediaControlPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
        if (name == NativeTTSMediaControlSpec.NAME) {
            NativeTTSMediaControl(reactContext)
        } else {
            null
        }

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            NativeTTSMediaControlSpec.NAME to ReactModuleInfo(
                NativeTTSMediaControlSpec.NAME,
                NativeTTSMediaControlSpec.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}
